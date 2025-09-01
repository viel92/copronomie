import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/supabase'

type Consultation = Database['public']['Tables']['consultations']['Row']
type UpdateConsultation = Database['public']['Tables']['consultations']['Update']

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer la consultation avec les relations
    const { data: consultation, error } = await supabase
      .from('consultations')
      .select(`
        *,
        coproprietes (
          id,
          nom,
          adresse,
          code_postal,
          ville,
          nb_lots
        ),
        devis (
          id,
          entreprise_nom,
          montant_total,
          statut,
          created_at,
          devis_items (
            id,
            description,
            quantite,
            prix_unitaire,
            montant_total
          )
        ),
        documents (
          id,
          name,
          type,
          size,
          url,
          created_at
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Consultation non trouvée' }, { status: 404 })
      }
      console.error('Erreur lors de la récupération de la consultation:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ consultation })

  } catch (error) {
    console.error('Erreur API consultation GET:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer les données de la requête
    const body: UpdateConsultation = await request.json()

    // Mettre à jour la consultation
    const { data: consultation, error } = await supabase
      .from('consultations')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Consultation non trouvée' }, { status: 404 })
      }
      console.error('Erreur lors de la mise à jour de la consultation:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ consultation })

  } catch (error) {
    console.error('Erreur API consultation PUT:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Supprimer la consultation
    const { error } = await supabase
      .from('consultations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur lors de la suppression de la consultation:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Consultation supprimée avec succès' })

  } catch (error) {
    console.error('Erreur API consultation DELETE:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}