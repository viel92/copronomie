import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  return withAuth(request, async (request, supabase, user) => {
    try {
      const { searchParams } = new URL(request.url)
      const limit = parseInt(searchParams.get('limit') || '50')
      const offset = parseInt(searchParams.get('offset') || '0')

      // Récupérer les comparaisons de l'utilisateur avec pagination
      const { data: comparisons, error } = await supabase
        .from('consultations')
        .select(`
          id,
          title,
          description,
          status,
          created_at,
          updated_at,
          devis:devis(count)
        `)
        .eq('organization_id', user.profile.organization_id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        console.error('Erreur lors de la récupération des comparaisons:', error)
        return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
      }

      return NextResponse.json({
        comparisons: comparisons || [],
        total: comparisons?.length || 0,
        limit,
        offset
      })
    } catch (error) {
      console.error('Erreur API comparisons GET:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
  })
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (request, supabase, user) => {
    try {
      const body = await request.json()
      const { data: comparisonData, files_count, title } = body

      // Créer une nouvelle consultation pour cette comparaison
      const { data: consultation, error: consultationError } = await supabase
        .from('consultations')
        .insert({
          title: title || `Comparaison IA - ${new Date().toLocaleDateString('fr-FR')}`,
          description: `Comparaison automatique de ${files_count || 0} devis via l'IA`,
          organization_id: user.profile.organization_id,
          created_by: user.id,
          status: 'completed',
          type: 'ai_comparison'
        })
        .select()
        .single()

      if (consultationError) {
        console.error('Erreur création consultation:', consultationError)
        return NextResponse.json({ error: 'Erreur lors de la création de la consultation' }, { status: 500 })
      }

      // Créer les devis individuels à partir des données de comparaison
      if (comparisonData.comparaison_detaillee && Array.isArray(comparisonData.comparaison_detaillee)) {
        const devisData = comparisonData.comparaison_detaillee.map((devis: any) => ({
          consultation_id: consultation.id,
          company_name: devis.entreprise,
          amount_ttc: devis.montant_total,
          amount_ht: devis.montant_ht || devis.montant_total * 0.8333, // Estimation TTC -> HT
          delivery_time: devis.delai_realisation,
          score: devis.note_sur_10,
          analysis_data: {
            points_forts: devis.points_forts,
            points_faibles: devis.points_faibles,
            materiel_propose: devis.materiel_propose,
            qualite_materiel: devis.qualite_materiel,
            garanties: devis.garanties,
            prestations_incluses: devis.prestations_incluses
          },
          status: 'analyzed'
        }))

        const { error: devisError } = await supabase
          .from('devis')
          .insert(devisData)

        if (devisError) {
          console.error('Erreur création devis:', devisError)
          // Ne pas échouer la requête, juste logger l'erreur
        }
      }

      return NextResponse.json({
        message: 'Comparaison sauvegardée avec succès',
        consultation,
        comparison_data: comparisonData
      }, { status: 201 })

    } catch (error) {
      console.error('Erreur API comparisons POST:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
  })
}