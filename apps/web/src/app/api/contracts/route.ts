import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  return withAuth(request, async (request, supabase, user) => {
    try {
      const url = new URL(request.url)
      const search = url.searchParams.get('search')
      const filter = url.searchParams.get('filter') || 'all'
      const copropriete_id = url.searchParams.get('copropriete_id')

      // Note: La table contracts n'existe pas encore, retourner un tableau vide
      return NextResponse.json({
        data: [],
        count: 0,
        message: 'Table contracts pas encore implémentée'
      })

      // Code original (commenté temporairement):
      /*
      let query = supabase
        .from('contracts')
        .select(`
          *,
          company:companies(name, email, phone)
        `)
        .eq('organization_id', user.profile.organization_id)
      */

      // Filtres
      if (search) {
        query = query.or(`name.ilike.%${search}%,type.ilike.%${search}%`)
      }

      // Filtre par copropriété
      if (copropriete_id && copropriete_id !== 'all') {
        query = query.eq('copropriete_id', copropriete_id)
      }

      // Filtrage par statut/urgence
      if (filter === 'expiring') {
        // Contrats expirant dans les 60 prochains jours
        const in60Days = new Date()
        in60Days.setDate(in60Days.getDate() + 60)
        query = query.lte('end_date', in60Days.toISOString().split('T')[0])
      } else if (filter === 'active') {
        query = query.eq('status', 'active')
      } else if (filter === 'expired') {
        query = query.eq('status', 'expired')
      }

      // Tri par date de fin
      query = query.order('end_date', { ascending: true })

      const { data: contracts, error } = await query

      if (error) {
        console.error('Erreur lors de la récupération des contrats:', error)
        return NextResponse.json({ error: 'Erreur lors de la récupération des contrats' }, { status: 500 })
      }

      // Calculer les alertes et jours restants
      const contractsWithAlerts = contracts?.map((contract: any) => {
        const endDate = new Date(contract.end_date)
        const today = new Date()
        const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        let alertLevel = 'normal'
        if (daysLeft < 0) {
          alertLevel = 'expired'
        } else if (daysLeft <= 30) {
          alertLevel = 'critical'
        } else if (daysLeft <= 60) {
          alertLevel = 'warning'
        }

        return {
          ...contract,
          daysLeft,
          alertLevel
        }
      }) || []

      return NextResponse.json({
        message: 'Contrats récupérés avec succès',
        contracts: contractsWithAlerts
      })
    } catch (error) {
      console.error('Erreur API contracts GET:', error)
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
        company_id,
        copropriete_id,
        amount,
        period,
        start_date,
        end_date,
        auto_renewal,
        alert_days,
        notes
      } = body

      // Validation des champs obligatoires
      if (!name || !type || !amount || !period || !start_date || !end_date) {
        return NextResponse.json(
          { error: 'Nom, type, montant, période, date de début et date de fin sont obligatoires' },
          { status: 400 }
        )
      }

      const { data: contract, error } = await supabase
        .from('contracts')
        .insert({
          user_id: user.id,
          name,
          type,
          company_id,
          copropriete_id: copropriete_id || null,
          amount: parseFloat(amount),
          period,
          start_date,
          end_date,
          status: 'active',
          auto_renewal: auto_renewal || false,
          alert_days: alert_days || 60,
          notes
        })
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de la création du contrat:', error)
        return NextResponse.json({ error: 'Erreur lors de la création du contrat' }, { status: 500 })
      }

      return NextResponse.json({
        message: 'Contrat créé avec succès',
        contract
      }, { status: 201 })
    } catch (error) {
      console.error('Erreur API contracts POST:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
  })
}