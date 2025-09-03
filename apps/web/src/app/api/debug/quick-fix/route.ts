import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const results: any = {
      user_id: user.id,
      steps: []
    }

    // 1. Vérifier s'il y a déjà une organisation
    const { data: existingOrgs, error: orgsError } = await supabase
      .from('organizations')
      .select('*')
      .limit(5)

    results.organizations_found = existingOrgs?.length || 0
    results.organizations = existingOrgs

    let orgId = null
    if (existingOrgs && existingOrgs.length > 0) {
      orgId = existingOrgs[0].id
      results.steps.push({
        step: 'use_existing_org',
        org_id: orgId,
        org_name: existingOrgs[0].name
      })
    } else {
      // Créer une organisation
      const userMetadata = user.user_metadata || {}
      const orgName = userMetadata.copro_name || userMetadata.company_name || 'REAL31'
      
      const { data: newOrg, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: orgName,
          slug: `real31-${Date.now()}`,
          plan: 'free',
          max_devis: 3,
          subscription_status: 'free'
        })
        .select()
        .single()

      if (orgError) {
        results.steps.push({
          step: 'create_org_failed',
          error: orgError.message
        })
        return NextResponse.json({
          ...results,
          error: 'Impossible de créer l\'organisation'
        })
      }

      orgId = newOrg.id
      results.steps.push({
        step: 'create_org_success',
        org: newOrg
      })
    }

    // 2. Créer le profil (RLS désactivé maintenant)
    const userMetadata = user.user_metadata || {}
    
    const { data: newProfile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        first_name: userMetadata.first_name || 'sekou',
        last_name: userMetadata.last_name || 'koma',
        organization_id: orgId,
        role: 'owner'
      })
      .select()
      .single()

    if (profileError) {
      results.steps.push({
        step: 'create_profile_failed',
        error: profileError.message
      })
      return NextResponse.json({
        ...results,
        error: 'Impossible de créer le profil',
        profileError: profileError.message
      })
    }

    results.steps.push({
      step: 'create_profile_success',
      profile: newProfile
    })

    // 3. Vérification finale avec organisation
    const { data: completeProfile, error: fetchError } = await supabase
      .from('profiles')
      .select(`
        *,
        organization:organizations(*)
      `)
      .eq('id', user.id)
      .single()

    results.steps.push({
      step: 'fetch_complete_profile',
      success: !fetchError,
      profile: completeProfile
    })

    return NextResponse.json({
      ...results,
      success: true,
      message: 'Profil créé avec succès! Allez sur /dashboard maintenant',
      final_profile: completeProfile
    })

  } catch (error) {
    console.error('Erreur quick fix:', error)
    return NextResponse.json({
      error: 'Erreur lors de la création',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}