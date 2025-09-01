import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  return withAuth(request, async (request, supabase, user) => {
    try {
      const url = new URL(request.url)
      const search = url.searchParams.get('search')
      const specialty = url.searchParams.get('specialty')
      const zone = url.searchParams.get('zone')
      const verified = url.searchParams.get('verified')
      const minRating = url.searchParams.get('minRating')
      const sortBy = url.searchParams.get('sortBy') || 'name'

      let query = supabase
        .from('companies')
        .select('*')
        .eq('organization_id', user.profile.organization_id)

      // Filtres de recherche
      if (search) {
        query = query.or(`name.ilike.%${search}%,specialty.ilike.%${search}%`)
      }
      
      if (specialty && specialty !== 'all') {
        query = query.eq('specialty', specialty)
      }
      
      if (zone && zone !== 'all') {
        query = query.eq('zone', zone)
      }
      
      if (verified === 'true') {
        query = query.eq('verified', true)
      }
      
      if (minRating) {
        query = query.gte('rating', parseFloat(minRating))
      }

      // Tri
      if (sortBy === 'rating') {
        query = query.order('rating', { ascending: false })
      } else if (sortBy === 'projects') {
        query = query.order('projects_count', { ascending: false })
      } else {
        query = query.order('name')
      }

      const { data: companies, error } = await query

      if (error) {
        console.error('Erreur lors de la récupération des entreprises:', error)
        return NextResponse.json({ error: 'Erreur lors de la récupération des entreprises' }, { status: 500 })
      }

      return NextResponse.json({
        message: 'Entreprises récupérées avec succès',
        companies: companies || []
      })
    } catch (error) {
      console.error('Erreur API companies GET:', error)
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
        siret,
        email,
        phone,
        address,
        specialty,
        zone,
        certifications,
        insurance_company,
        insurance_expiry,
        notes
      } = body

      // Validation des champs obligatoires
      if (!name || !specialty) {
        return NextResponse.json(
          { error: 'Nom et spécialité sont obligatoires' },
          { status: 400 }
        )
      }

      const { data: company, error } = await supabase
        .from('companies')
        .insert({
          organization_id: user.profile.organization_id,
          name,
          siret,
          email,
          phone,
          address,
          specialty,
          zone,
          certifications: certifications || [],
          insurance_company,
          insurance_expiry,
          notes,
          verified: false, // Par défaut non vérifiée
          rating: 0,
          reviews_count: 0,
          projects_count: 0
        })
        .select()
        .single()

      if (error) {
        console.error('Erreur lors de la création de l\'entreprise:', error)
        return NextResponse.json({ error: 'Erreur lors de la création de l\'entreprise' }, { status: 500 })
      }

      return NextResponse.json({
        message: 'Entreprise créée avec succès',
        company
      }, { status: 201 })
    } catch (error) {
      console.error('Erreur API companies POST:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
  })
}