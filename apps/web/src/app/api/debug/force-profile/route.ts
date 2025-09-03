import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    console.log('🔍 FORCE PROFILE - USER:', user.id, user.email)

    // 1. Vérifier si le profil existe
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!checkError && existingProfile) {
      console.log('✅ PROFIL EXISTE DÉJÀ:', existingProfile)
      return NextResponse.json({
        success: true,
        message: 'Profil existe déjà',
        profile: existingProfile
      })
    }

    console.log('❌ AUCUN PROFIL - CRÉATION FORCÉE')
    
    // 2. Récupérer ou créer une organisation
    let { data: orgs } = await supabase
      .from('organizations')
      .select('*')
      .limit(1)

    let orgId = null
    if (!orgs || orgs.length === 0) {
      console.log('🏗️ CRÉATION D\'UNE NOUVELLE ORGANISATION')
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
        console.error('❌ ERREUR CRÉATION ORGANISATION:', orgError)
        return NextResponse.json({
          error: 'Impossible de créer l\'organisation',
          details: orgError.message
        }, { status: 500 })
      }
      
      orgId = newOrg.id
      console.log('✅ ORGANISATION CRÉÉE:', orgId)
    } else {
      orgId = orgs[0].id
      console.log('🏢 UTILISATION ORGANISATION EXISTANTE:', orgId)
    }

    // 3. Créer le profil DIRECTEMENT (RLS désactivé)
    const userMetadata = user.user_metadata || {}
    
    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        first_name: userMetadata.first_name || 'Prénom',
        last_name: userMetadata.last_name || 'Nom',
        organization_id: orgId,
        role: 'owner'
      })
      .select()
      .single()

    if (profileError) {
      console.error('❌ ERREUR CRÉATION PROFIL:', profileError)
      return NextResponse.json({
        error: 'Impossible de créer le profil',
        details: profileError.message
      }, { status: 500 })
    }

    console.log('✅ PROFIL CRÉÉ AVEC SUCCÈS:', newProfile)

    return NextResponse.json({
      success: true,
      message: 'Profil créé avec succès!',
      profile: newProfile,
      organization_used: orgs[0]
    })

  } catch (error) {
    console.error('💥 ERREUR FORCE PROFILE:', error)
    return NextResponse.json({
      error: 'Erreur lors de la création forcée',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
