import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pages publiques qui n'ont pas besoin d'auth
  const publicPaths = [
    '/',
    '/about',
    '/contact',
    '/pricing',
    '/terms',
    '/privacy',
    '/legal',
    '/auth/login',
    '/auth/register',
    '/auth/callback'
  ]

  // APIs publiques
  const publicApiPaths = [
    '/api/auth/',
    '/api/debug/'
  ]

  // Laisser passer les pages publiques
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Laisser passer les APIs publiques
  if (publicApiPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Pour toutes les autres routes (dashboard, etc.), vérifier l'auth
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Si pas d'utilisateur authentifié, rediriger vers login
    if (authError || !user) {
      console.log('🚫 Middleware: Utilisateur non authentifié, redirection vers /auth/login')
      const loginUrl = new URL('/auth/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    console.log('👤 Middleware: Utilisateur authentifié:', user.email)

    // Vérifier si le profil existe
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq('id', user.id)
      .single()

    // Si pas de profil, créer automatiquement
    if (profileError || !profile) {
      console.log('⚠️ Middleware: Pas de profil trouvé, création automatique...')
      
      try {
        // Créer ou récupérer une organisation
        let { data: orgs } = await supabase
          .from('organizations')
          .select('*')
          .limit(1)

        let orgId = null
        if (!orgs || orgs.length === 0) {
          // Créer une organisation
          const userMetadata = user.user_metadata || {}
          const orgName = userMetadata.copro_name || userMetadata.company_name || `Organisation de ${user.email?.split('@')[0] || 'utilisateur'}`
          
          const { data: newOrg, error: orgError } = await supabase
            .from('organizations')
            .insert({
              name: orgName,
              slug: `org-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              plan: 'free',
              max_devis: 3,
              subscription_status: 'free'
            })
            .select()
            .single()

          if (orgError) {
            console.error('❌ Middleware: Erreur création organisation:', orgError)
            // Si on ne peut pas créer l'org, rediriger vers une page d'erreur
            const errorUrl = new URL('/auth/setup-error', request.url)
            return NextResponse.redirect(errorUrl)
          }
          
          orgId = newOrg.id
          console.log('✅ Middleware: Organisation créée:', orgId)
        } else {
          orgId = orgs[0].id
          console.log('🏢 Middleware: Utilisation organisation existante:', orgId)
        }

        // Créer le profil
        const userMetadata = user.user_metadata || {}
        const { data: newProfile, error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            first_name: userMetadata.first_name || null,
            last_name: userMetadata.last_name || null,
            organization_id: orgId,
            role: 'owner'
          })
          .select()
          .single()

        if (createProfileError) {
          console.error('❌ Middleware: Erreur création profil:', createProfileError)
          // Si on ne peut pas créer le profil, rediriger vers une page d'erreur
          const errorUrl = new URL('/auth/setup-error', request.url)
          return NextResponse.redirect(errorUrl)
        }

        console.log('✅ Middleware: Profil créé avec succès pour', user.email)
      } catch (error) {
        console.error('💥 Middleware: Erreur lors de la création du profil:', error)
        const errorUrl = new URL('/auth/setup-error', request.url)
        return NextResponse.redirect(errorUrl)
      }
    } else {
      console.log('✅ Middleware: Profil existant trouvé pour', user.email)
    }

    // Tout est bon, laisser passer
    return NextResponse.next()

  } catch (error) {
    console.error('💥 Middleware: Erreur générale:', error)
    const loginUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}