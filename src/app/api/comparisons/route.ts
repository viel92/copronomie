import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('comparisons')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des comparaisons:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API comparisons GET:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le profil de l'utilisateur pour obtenir l'organization_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profil utilisateur introuvable' }, { status: 404 })
    }

    const body = await request.json()
    const { data: comparisonData, files_count } = body

    const { data, error } = await supabase
      .from('comparisons')
      .insert([{
        user_id: user.id,
        organization_id: profile.organization_id,
        data: comparisonData,
        files_count: files_count || 0
      }])
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de la comparaison:', error)
      return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Erreur API comparisons POST:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}