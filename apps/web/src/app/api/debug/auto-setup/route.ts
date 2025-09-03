import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const results: any = {
      user_id: user.id,
      user_email: user.email,
      steps: []
    }

    // Étape 1: Vérifier si le profil existe déjà
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*, organization:organizations(*)')
      .eq('id', user.id)
      .single()

    if (!profileCheckError && existingProfile) {
      results.steps.push({
        step: 'profile_check',
        status: 'already_exists',
        profile: existingProfile
      })
      return NextResponse.json({
        ...results,
        success: true,
        message: 'Profil déjà existant',
        profile: existingProfile
      })
    }

    results.steps.push({
      step: 'profile_check',
      status: 'not_found',
      message: 'Profil à créer'
    })

    // Étape 2: Créer l'organisation
    const userMetadata = user.user_metadata || {}
    const orgName = userMetadata.copro_name || userMetadata.company_name || `Organisation de ${user.email?.split('@')[0] || 'utilisateur'}`
    const orgSlug = `org-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    let organization = null
    try {
      // Approche 1: Insertion directe
      const { data: newOrg, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: orgName,
          slug: orgSlug,
          plan: 'free',
          max_devis: 3,
          subscription_status: 'free'
        })
        .select()
        .single()

      if (orgError) {
        results.steps.push({
          step: 'create_organization',
          status: 'failed_direct',
          error: orgError.message
        })

        // Approche 2: RPC si disponible
        try {
          const { data: rpcResult, error: rpcError } = await supabase
            .rpc('create_organization_bypass_rls', {
              org_name: orgName,
              org_slug: orgSlug
            })

          if (rpcError) {
            results.steps.push({
              step: 'create_organization',
              status: 'failed_rpc',
              error: rpcError.message
            })
            throw new Error('RPC également échoué')
          }

          organization = rpcResult
          results.steps.push({
            step: 'create_organization',
            status: 'success_rpc',
            organization
          })
        } catch (e) {
          // Approche 3: Instructions manuelles
          return NextResponse.json({
            ...results,
            success: false,
            error: 'RLS bloque la création automatique',
            manual_solution: {
              step1: `INSERT INTO organizations (name, slug, plan, max_devis, subscription_status) VALUES ('${orgName}', '${orgSlug}', 'free', 3, 'free') RETURNING id;`,
              step2: 'Copiez l\'ID retourné et utilisez-le dans l\'étape suivante',
              step3: `INSERT INTO profiles (id, first_name, last_name, organization_id, role) VALUES ('${user.id}', '${userMetadata.first_name || 'NULL'}', '${userMetadata.last_name || 'NULL'}', 'YOUR_ORG_ID', 'owner');`
            }
          })
        }
      } else {
        organization = newOrg
        results.steps.push({
          step: 'create_organization',
          status: 'success_direct',
          organization
        })
      }
    } catch (error) {
      results.steps.push({
        step: 'create_organization',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      throw error
    }

    // Étape 3: Créer le profil
    try {
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          first_name: userMetadata.first_name || null,
          last_name: userMetadata.last_name || null,
          organization_id: organization.id,
          role: 'owner'
        })
        .select()
        .single()

      if (profileError) {
        results.steps.push({
          step: 'create_profile',
          status: 'failed',
          error: profileError.message,
          manual_sql: `INSERT INTO profiles (id, first_name, last_name, organization_id, role) VALUES ('${user.id}', '${userMetadata.first_name || 'NULL'}', '${userMetadata.last_name || 'NULL'}', '${organization.id}', 'owner');`
        })
        throw profileError
      }

      results.steps.push({
        step: 'create_profile',
        status: 'success',
        profile: newProfile
      })

      // Étape 4: Récupérer le profil complet
      const { data: completeProfile, error: fetchError } = await supabase
        .from('profiles')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('id', user.id)
        .single()

      results.steps.push({
        step: 'fetch_complete_profile',
        status: fetchError ? 'failed' : 'success',
        error: fetchError?.message,
        profile: completeProfile
      })

      return NextResponse.json({
        ...results,
        success: true,
        message: 'Profil créé avec succès!',
        profile: completeProfile || newProfile,
        organization
      })

    } catch (error) {
      return NextResponse.json({
        ...results,
        success: false,
        error: 'Erreur lors de la création du profil',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Erreur auto setup:', error)
    return NextResponse.json({
      error: 'Erreur lors de l\'initialisation automatique',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}