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

    const { user_id, first_name, last_name, organization_id, role } = await request.json()

    // Vérifier que l'utilisateur crée son propre profil
    if (user.id !== user_id) {
      return NextResponse.json({ error: 'Permission refusée' }, { status: 403 })
    }

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user_id,
          first_name,
          last_name,
          organization_id,
          role: role || 'owner'
        })
        .select()
        .single()

      if (profileError) {
        console.error('Erreur création profil:', profileError)
        
        // Si RLS bloque, retourner les instructions manuelles
        return NextResponse.json({
          error: 'RLS bloque la création du profil',
          manual_sql: `INSERT INTO profiles (id, first_name, last_name, organization_id, role) VALUES ('${user_id}', '${first_name || 'NULL'}', '${last_name || 'NULL'}', '${organization_id}', '${role || 'owner'}') RETURNING *;`,
          reason: profileError.message
        }, { status: 403 })
      }

      return NextResponse.json({
        success: true,
        profile,
        method: 'direct'
      })

    } catch (error) {
      console.error('Erreur create profile:', error)
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