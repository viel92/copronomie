import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { Database } from '@/types/supabase'

type Consultation = Database['public']['Tables']['consultations']['Row']
type NewConsultation = Database['public']['Tables']['consultations']['Insert']

export async function GET(request: NextRequest) {
  return withAuth(request, async (request, supabase, user) => {
    try {
      // Récupérer les paramètres de filtrage
      const searchParams = request.nextUrl.searchParams
      const status = searchParams.get('status')
      const copropriete_id = searchParams.get('copropriete_id')
      const limit = searchParams.get('limit') || '50'
      const offset = searchParams.get('offset') || '0'

      // Construire la requête - Simplifiée pour éviter les erreurs de colonnes
      let query = supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(parseInt(limit))
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

      // Appliquer les filtres
      if (status) {
        query = query.eq('status', status)
      }
      if (copropriete_id) {
        query = query.eq('copropriete_id', copropriete_id)
      }

      const { data: consultations, error } = await query

      if (error) {
        console.error('Erreur lors de la récupération des consultations:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ 
        consultations: consultations || [],
        total: consultations?.length || 0 
      })

    } catch (error) {
      console.error('Erreur API consultations GET:', error)
      return NextResponse.json(
        { error: 'Erreur serveur' },
        { status: 500 }
      )
    }
  })
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (request, supabase, user) => {
    try {
      // Récupérer les données de la requête
      const body: NewConsultation = await request.json()

      // Validation basique
      if (!body.title || !body.copropriete_id || !body.organization_id) {
        return NextResponse.json(
          { error: 'Données manquantes: title, copropriete_id et organization_id sont requis' },
          { status: 400 }
        )
      }

      // Créer la consultation
      const { data: consultation, error } = await supabase
        .from('consultations')
        .insert({
          ...body,
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: body.status || 'draft'
        })
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de la création de la consultation:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ consultation }, { status: 201 })

    } catch (error) {
      console.error('Erreur API consultations POST:', error)
      return NextResponse.json(
        { error: 'Erreur serveur' },
        { status: 500 }
      )
    }
  })
}