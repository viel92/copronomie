import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({
        auth: false,
        error: authError?.message || 'Pas d\'utilisateur connecté'
      })
    }

    const results: any = {
      user_id: user.id,
      user_email: user.email,
      steps: []
    }

    // 1. Vérifier combien de profils existent
    try {
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)

      results.steps.push({
        step: 1,
        action: 'Check existing profiles',
        success: !allError,
        error: allError?.message,
        count: allProfiles?.length || 0,
        profiles: allProfiles
      })

      // 2. Si plusieurs profils, les supprimer
      if (allProfiles && allProfiles.length > 1) {
        const { error: deleteError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id)

        results.steps.push({
          step: 2,
          action: 'Delete duplicate profiles',
          success: !deleteError,
          error: deleteError?.message
        })
      }

      // 3. Si aucun profil, en créer un
      if (!allProfiles || allProfiles.length === 0) {
        // D'abord créer l'organisation
        const userMetadata = user.user_metadata || {}
        const companyName = userMetadata.copro_name || userMetadata.company_name || `Organisation de ${user.email}`
        
        const { data: newOrg, error: orgError } = await supabase
          .from('organizations')
          .insert({
            name: companyName,
            slug: `org-${Date.now()}`,
            plan: 'free',
            max_devis: 3
          })
          .select()
          .single()

        results.steps.push({
          step: 3,
          action: 'Create organization',
          success: !orgError,
          error: orgError?.message,
          organization: newOrg
        })

        if (!orgError && newOrg) {
          // Ensuite créer le profil
          const { data: newProfile, error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              first_name: userMetadata.first_name || null,
              last_name: userMetadata.last_name || null,
              organization_id: newOrg.id,
              role: 'owner'
            })
            .select()
            .single()

          results.steps.push({
            step: 4,
            action: 'Create profile',
            success: !profileError,
            error: profileError?.message,
            profile: newProfile
          })
        }
      }

      // 4. Vérification finale
      const { data: finalProfile, error: finalError } = await supabase
        .from('profiles')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('id', user.id)
        .single()

      results.steps.push({
        step: 5,
        action: 'Final verification',
        success: !finalError,
        error: finalError?.message,
        final_profile: finalProfile
      })

      results.success = !finalError
      results.profile = finalProfile

    } catch (error) {
      results.steps.push({
        step: 'error',
        action: 'Exception caught',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Erreur fix profile:', error)
    return NextResponse.json({
      error: 'Erreur lors de la correction du profil',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}