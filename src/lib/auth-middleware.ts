import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/server-client'
import type { SupabaseClient, User } from '@supabase/supabase-js'

interface UserWithProfile extends User {
  profile: {
    id: string
    organization_id: string
    role: string
    organization: {
      id: string
      name: string
      plan: string
    }
  }
}

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, supabase: SupabaseClient, user: UserWithProfile) => Promise<NextResponse>
) {
  try {
    const supabase = await createApiClient(request)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    console.log('Auth middleware - Cookies reçus:', request.cookies.toString())
    console.log('Auth middleware - user:', user?.id, 'error:', error)
    
    if (error || !user) {
      console.log('Auth middleware - Non authentifié:', error?.message)
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le profil complet avec l'organisation
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, organization:organizations(*)')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.log('Auth middleware - Profil non trouvé:', profileError?.message)
      return NextResponse.json({ error: 'Profil non trouvé' }, { status: 403 })
    }

    // Ajouter le profil à l'objet user
    const userWithProfile: UserWithProfile = {
      ...user,
      profile
    }

    console.log('Auth middleware - Utilisateur authentifié:', user.email)
    return await handler(request, supabase, userWithProfile)
  } catch (error) {
    console.error('Erreur middleware auth:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}