import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({
        auth: false,
        error: authError?.message || 'Pas d\'utilisateur connecté'
      })
    }

    const results: any = {
      user_id: user.id,
      user_email: user.email,
      user_metadata: user.user_metadata,
      diagnostics: {}
    }

    // 1. Vérifier si le trigger existe
    try {
      const { data: triggerInfo, error: triggerError } = await supabase
        .rpc('exec_sql', { 
          sql: `
            SELECT 
              t.trigger_name,
              t.event_manipulation,
              t.action_timing,
              p.proname as function_name
            FROM information_schema.triggers t
            LEFT JOIN pg_proc p ON p.oid = (
              SELECT oid FROM pg_proc WHERE proname = 'handle_new_user'
            )
            WHERE t.event_object_table = 'users'
            AND t.trigger_schema = 'auth';
          `
        })

      results.diagnostics.trigger_exists = !triggerError
      results.diagnostics.trigger_info = triggerInfo || 'Non accessible via RPC'
    } catch (e) {
      results.diagnostics.trigger_check = 'RPC non disponible'
    }

    // 2. Vérifier les logs d'erreur récents (si accessibles)
    try {
      // Regarder s'il y a des organisations créées récemment
      const { data: recentOrgs, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      results.diagnostics.recent_organizations = {
        success: !orgsError,
        error: orgsError?.message,
        count: recentOrgs?.length || 0,
        data: recentOrgs
      }
    } catch (e) {
      results.diagnostics.recent_orgs_check = 'Erreur'
    }

    // 3. Tester la création manuelle avec SECURITY DEFINER
    try {
      // Créer une fonction de test qui utilise SECURITY DEFINER
      const testFunction = `
        DO $$
        DECLARE
          new_org_id UUID;
          org_slug TEXT;
          test_user_id UUID := '${user.id}';
          user_metadata_val JSONB := '${JSON.stringify(user.user_metadata || {})}'::jsonb;
        BEGIN
          -- Générer un slug unique
          org_slug := 'test-org-' || EXTRACT(EPOCH FROM NOW())::INTEGER;
          
          -- Tester la création d'organisation
          INSERT INTO public.organizations (name, slug, plan, max_devis)
          VALUES (
            COALESCE(user_metadata_val->>'copro_name', user_metadata_val->>'company_name', 'Test Org'),
            org_slug,
            'free',
            3
          ) RETURNING id INTO new_org_id;
          
          -- Si on arrive ici, l'org est créée, on teste le profil
          INSERT INTO public.profiles (
            id, 
            first_name, 
            last_name, 
            organization_id, 
            role
          )
          VALUES (
            test_user_id,
            user_metadata_val->>'first_name',
            user_metadata_val->>'last_name',
            new_org_id,
            'owner'
          );
          
          RAISE NOTICE 'SUCCESS: Created org % and profile for user %', new_org_id, test_user_id;
          
        EXCEPTION
          WHEN OTHERS THEN
            RAISE NOTICE 'ERROR in manual creation: %', SQLERRM;
        END $$;
      `

      const { error: testError } = await supabase.rpc('exec_sql', { sql: testFunction })
      
      results.diagnostics.manual_test = {
        attempted: true,
        error: testError?.message,
        success: !testError
      }
    } catch (e) {
      results.diagnostics.manual_test = {
        attempted: true,
        error: 'RPC exec_sql non disponible'
      }
    }

    // 4. Solution de contournement : créer directement les données
    if (!results.diagnostics.manual_test?.success) {
      const userMetadata = user.user_metadata || {}
      const companyName = userMetadata.copro_name || userMetadata.company_name || `Organisation de ${user.email}`
      
      results.proposed_solution = {
        message: "Le trigger ne fonctionne pas. Voici les données à insérer manuellement :",
        step1_organization: {
          sql: `INSERT INTO organizations (name, slug, plan, max_devis, subscription_status) VALUES ('${companyName}', 'org-${Date.now()}', 'free', 3, 'free') RETURNING id;`,
          note: "Copiez l'ID retourné pour l'étape 2"
        },
        step2_profile: {
          sql: `INSERT INTO profiles (id, first_name, last_name, organization_id, role) VALUES ('${user.id}', '${userMetadata.first_name || 'NULL'}', '${userMetadata.last_name || 'NULL'}', 'REPLACE_WITH_ORG_ID', 'owner');`,
          note: "Remplacez REPLACE_WITH_ORG_ID par l'ID de l'étape 1"
        },
        alternative: "Ou désactivez temporairement RLS sur les tables organizations et profiles"
      }
    }

    // 5. Vérification finale des profils
    const { data: existingProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)

    results.final_check = {
      profiles_found: existingProfiles?.length || 0,
      profiles: existingProfiles,
      error: profilesError?.message
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Erreur trigger status:', error)
    return NextResponse.json({
      error: 'Erreur lors du diagnostic des triggers',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}