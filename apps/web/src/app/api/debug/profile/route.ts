import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 1. Vérifier l'utilisateur actuel
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({
        auth: false,
        error: authError?.message || 'Pas d\'utilisateur connecté'
      })
    }

    const results: any = {
      auth: true,
      user_id: user.id,
      user_email: user.email,
      user_metadata: user.user_metadata,
      profiles: {},
      organizations: {}
    }
    
    // 2. Tester la table profiles
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      results.profiles = {
        exists: !profileError,
        error: profileError?.message,
        data: profileData,
        structure: profileData ? Object.keys(profileData) : null
      }
    } catch (e) {
      results.profiles = { exists: false, error: 'Table profiles not found' }
    }

    // 3. Tester la table user_profiles
    try {
      const { data: userProfileData, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      results.user_profiles = {
        exists: !userProfileError,
        error: userProfileError?.message,
        data: userProfileData,
        structure: userProfileData ? Object.keys(userProfileData) : null
      }
    } catch (e) {
      results.user_profiles = { exists: false, error: 'Table user_profiles not found' }
    }

    // 4. Si on a trouvé un profil avec organization_id, chercher l'organisation
    let orgId = results.profiles?.data?.organization_id || results.user_profiles?.data?.organization_id
    if (orgId) {
      try {
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', orgId)
          .single()
        
        results.organizations = {
          exists: !orgError,
          error: orgError?.message,
          data: orgData,
          structure: orgData ? Object.keys(orgData) : null
        }
      } catch (e) {
        results.organizations = { exists: false, error: 'Table organizations not found' }
      }
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Erreur debug profile:', error)
    return NextResponse.json({
      error: 'Erreur lors de la vérification du profil',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}