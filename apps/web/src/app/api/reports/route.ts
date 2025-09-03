import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  return withAuth(request, async (request, supabase, user) => {
    try {
      const url = new URL(request.url)
      const type = url.searchParams.get('type')
      const copropriete_id = url.searchParams.get('copropriete_id')
      const limit = parseInt(url.searchParams.get('limit') || '10')

      let query = supabase
        .from('reports')
        .select(`
          *,
          generated_by_profile:profiles!reports_generated_by_fkey(
            first_name,
            last_name
          )
        `)
        .eq('organization_id', user.profile.organization_id)
        .order('generated_at', { ascending: false })
        .limit(limit)

      if (type && type !== 'all') {
        query = query.eq('type', type)
      }

      // Filtre par copropriété
      if (copropriete_id && copropriete_id !== 'all') {
        query = query.eq('copropriete_id', copropriete_id)
      }

      const { data: reports, error } = await query

      if (error) {
        console.error('Erreur lors de la récupération des rapports:', error)
        return NextResponse.json({ error: 'Erreur lors de la récupération des rapports' }, { status: 500 })
      }

      return NextResponse.json({
        message: 'Rapports récupérés avec succès',
        reports: reports || []
      })
    } catch (error) {
      console.error('Erreur API reports GET:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
  })
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (request, supabase, user) => {
    try {
      const body = await request.json()
      const {
        name,
        type,
        copropriete_id,
        date_range_start,
        date_range_end,
        parameters
      } = body

      // Validation des champs obligatoires
      if (!name || !type) {
        return NextResponse.json(
          { error: 'Nom et type sont obligatoires' },
          { status: 400 }
        )
      }

      const { data: report, error } = await supabase
        .from('reports')
        .insert({
          organization_id: user.profile.organization_id,
          name,
          type,
          copropriete_id: copropriete_id || null,
          date_range_start,
          date_range_end,
          generated_by: user.id,
          parameters: parameters || {},
          status: 'generating'
        })
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de la création du rapport:', error)
        return NextResponse.json({ error: 'Erreur lors de la création du rapport' }, { status: 500 })
      }

      // TODO: Ici on pourrait déclencher la génération asynchrone du rapport
      // Pour l'instant on marque comme généré immédiatement
      const { data: updatedReport, error: updateError } = await supabase
        .from('reports')
        .update({ 
          status: 'generated',
          file_size: Math.floor(Math.random() * 500000) + 100000 // Taille mockée
        })
        .eq('id', report.id)
        .select()
        .single()

      if (updateError) {
        console.error('Erreur lors de la mise à jour du rapport:', updateError)
      }

      return NextResponse.json({
        message: 'Rapport créé avec succès',
        report: updatedReport || report
      }, { status: 201 })
    } catch (error) {
      console.error('Erreur API reports POST:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
  })
}