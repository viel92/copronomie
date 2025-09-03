import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { name, slug, user_id } = await request.json()

    // Créer l'organisation en utilisant le client admin si possible
    // Sinon, on va utiliser une approche par service
    try {
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name,
          slug,
          plan: 'free',
          max_devis: 3,
          subscription_status: 'free'
        })
        .select()
        .single()

      if (orgError) {
        console.error('Erreur création organisation:', orgError)
        
        // Si RLS bloque, on essaie avec une fonction SQL
        const createOrgFunction = `
          SELECT create_organization_for_user($1, $2, $3);
        `
        
        try {
          const { data: funcResult, error: funcError } = await supabase
            .rpc('create_organization_for_user', {
              org_name: name,
              org_slug: slug,
              owner_id: user_id
            })

          if (funcError) {
            // En dernier recours, on retourne les instructions SQL
            return NextResponse.json({
              error: 'RLS bloque la création',
              manual_sql: `INSERT INTO organizations (name, slug, plan, max_devis, subscription_status) VALUES ('${name}', '${slug}', 'free', 3, 'free') RETURNING *;`,
              reason: orgError.message
            }, { status: 403 })
          }

          return NextResponse.json({
            success: true,
            organization: funcResult,
            method: 'function'
          })
        } catch (e) {
          return NextResponse.json({
            error: 'Impossible de créer l\'organisation',
            details: orgError.message,
            suggestion: 'Désactiver temporairement RLS ou utiliser une clé service'
          }, { status: 500 })
        }
      }

      return NextResponse.json({
        success: true,
        organization,
        method: 'direct'
      })

    } catch (error) {
      console.error('Erreur create organization:', error)
      return NextResponse.json({
        error: 'Erreur serveur',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 })
    }

  } catch (error) {
    return NextResponse.json({
      error: 'Erreur parsing request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 })
  }
}