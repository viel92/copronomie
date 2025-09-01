import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le profil de l'utilisateur pour obtenir son organization_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.organization_id) {
      console.error('Erreur profil:', profileError)
      return NextResponse.json({ error: 'Organisation non trouvée' }, { status: 404 })
    }

    // Récupérer les copropriétés de l'organisation
    const { data: coproprietes, error } = await supabase
      .from('coproprietes')
      .select(`
        id,
        name,
        address,
        created_at
      `)
      .eq('organization_id', profile.organization_id)
      .order('name', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des copropriétés:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      coproprietes: coproprietes || [],
      total: coproprietes?.length || 0 
    })

  } catch (error) {
    console.error('Erreur API coproprietes:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le profil de l'utilisateur
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.organization_id) {
      return NextResponse.json({ error: 'Organisation non trouvée' }, { status: 404 })
    }

    // Récupérer les données de la requête
    const body = await request.json()

    // Validation basique
    if (!body.name || !body.address) {
      return NextResponse.json(
        { error: 'Données manquantes: name et address sont requis' },
        { status: 400 }
      )
    }

    // Créer la copropriété
    const { data: copropriete, error } = await supabase
      .from('coproprietes')
      .insert({
        ...body,
        organization_id: profile.organization_id,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de la copropriété:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ copropriete }, { status: 201 })

  } catch (error) {
    console.error('Erreur API coproprietes POST:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}