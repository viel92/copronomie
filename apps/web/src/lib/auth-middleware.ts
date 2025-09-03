import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/server-client'
import type { SupabaseClient, User } from '@supabase/supabase-js'

interface UserWithProfile extends User {
  profile: {
    id: string
    first_name: string | null
    last_name: string | null
    organization_id: string
    role: 'owner' | 'admin' | 'member'
    avatar_url: string | null
    created_at: string
    updated_at: string
    organization?: {
      id: string
      name: string
      slug: string
      plan: string
      max_devis: number
      subscription_status: string
    }
  }
}

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, supabase: any, user: UserWithProfile) => Promise<NextResponse>
) {
  try {
    const supabase = await createApiClient(request)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth middleware - Cookies reçus:', request.cookies.toString())
      console.log('Auth middleware - user:', user?.id, 'error:', error)
    }
    
    if (error || !user) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth middleware - Non authentifié:', error?.message)
      }
      return NextResponse.json(
        { error: 'Authentification requise', code: 'AUTH_REQUIRED' }, 
        { status: 401 }
      )
    }

    // Récupérer le profil utilisateur avec organisation
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth middleware - Profil non trouvé:', profileError?.message)
      }
      return NextResponse.json(
        { error: 'Profil utilisateur requis', code: 'PROFILE_REQUIRED' }, 
        { status: 403 }
      )
    }

    // Pour l'instant, on ne vérifie pas l'abonnement
    // TODO: Implémenter la vérification d'abonnement si nécessaire

    // Ajouter le profil à l'objet user
    const userWithProfile: UserWithProfile = {
      ...user,
      profile
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Auth middleware - Utilisateur authentifié:', user.email)
    }
    return await handler(request, supabase, userWithProfile)
  } catch (error) {
    console.error('Erreur middleware auth:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}