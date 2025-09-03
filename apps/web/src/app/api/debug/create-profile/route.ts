import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({
        auth: false,
        error: authError?.message || 'Pas d\'utilisateur connecté'
      })
    }

    // Utiliser la fonction SQL existante handle_new_user qui a SECURITY DEFINER
    // Cette fonction bypasse RLS
    try {
      // Créer un appel à la fonction handle_new_user avec les bonnes données
      const { data, error } = await supabase.rpc('handle_new_user_manual', {
        user_id: user.id,
        user_email: user.email,
        user_metadata: user.user_metadata || {}
      })

      if (error) {
        // Si la fonction n'existe pas, on va la créer puis l'appeler
        console.log('Fonction handle_new_user_manual non trouvée, tentative directe...')
        
        // Créer d'abord la fonction SQL
        const createFunctionQuery = `
          CREATE OR REPLACE FUNCTION handle_new_user_manual(
            user_id UUID,
            user_email TEXT,
            user_metadata JSONB
          )
          RETURNS JSONB
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          DECLARE
            new_org_id UUID;
            org_slug TEXT;
            company_name_value TEXT;
            first_name_value TEXT;
            last_name_value TEXT;
            result JSONB;
          BEGIN
            -- Récupérer les valeurs des metadata
            company_name_value := COALESCE(user_metadata->>'company_name', user_metadata->>'copro_name', 'Organisation');
            first_name_value := COALESCE(user_metadata->>'first_name', '');
            last_name_value := COALESCE(user_metadata->>'last_name', '');
            
            -- Créer le slug de l'organisation
            org_slug := LOWER(TRIM(company_name_value));
            org_slug := REGEXP_REPLACE(org_slug, '[^a-z0-9\\s]', '', 'g');
            org_slug := REGEXP_REPLACE(org_slug, '\\s+', '-', 'g');
            org_slug := 'org-' || EXTRACT(EPOCH FROM NOW())::INTEGER;
            
            -- Créer l'organisation
            INSERT INTO public.organizations (name, slug, plan, max_devis)
            VALUES (
              company_name_value,
              org_slug,
              'free',
              3
            )
            RETURNING id INTO new_org_id;
            
            -- Créer le profil utilisateur
            INSERT INTO public.profiles (
              id, 
              first_name, 
              last_name, 
              organization_id, 
              role
            )
            VALUES (
              user_id,
              NULLIF(first_name_value, ''),
              NULLIF(last_name_value, ''),
              new_org_id,
              'owner'
            );
            
            -- Retourner le résultat
            SELECT jsonb_build_object(
              'success', true,
              'organization_id', new_org_id,
              'user_id', user_id
            ) INTO result;
            
            RETURN result;
          EXCEPTION
            WHEN OTHERS THEN
              RETURN jsonb_build_object(
                'success', false,
                'error', SQLERRM
              );
          END;
          $$;
        `

        // Exécuter la création de la fonction via une requête SQL brute
        const { error: createError } = await supabase.rpc('exec', { 
          sql: createFunctionQuery 
        })

        if (createError) {
          // Essayons sans RPC, directement avec la fonction existante
          return NextResponse.json({
            message: 'Tentative avec trigger existant...',
            instructions: 'Reconnectez-vous pour déclencher le trigger automatique',
            user_id: user.id,
            user_metadata: user.user_metadata,
            next_step: 'Allez sur /auth/login puis /auth/register pour déclencher le trigger'
          })
        }

        // Maintenant appeler la fonction créée
        const { data: result, error: execError } = await supabase.rpc('handle_new_user_manual', {
          user_id: user.id,
          user_email: user.email,
          user_metadata: user.user_metadata || {}
        })

        return NextResponse.json({
          success: !execError,
          error: execError?.message,
          result: result,
          method: 'manual_function'
        })
      }

      return NextResponse.json({
        success: true,
        result: data,
        method: 'existing_function'
      })

    } catch (error) {
      console.error('Erreur lors de l\'appel de fonction:', error)
      
      // Fallback : instructions manuelles
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: true,
        instructions: [
          '1. Le trigger automatique devrait normalement créer votre profil',
          '2. Votre compte existe déjà, il faut peut-être déclencher manuellement le trigger',
          '3. Essayez de vous déconnecter complètement puis vous reconnecter',
          '4. Ou contactez l\'administrateur pour ajouter manuellement votre profil'
        ],
        user_info: {
          id: user.id,
          email: user.email,
          metadata: user.user_metadata
        }
      })
    }

  } catch (error) {
    console.error('Erreur create profile:', error)
    return NextResponse.json({
      error: 'Erreur lors de la création du profil',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}