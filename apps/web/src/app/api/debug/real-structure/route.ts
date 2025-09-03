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
      user_metadata: user.user_metadata,
      tables: {}
    }

    // 1. Tester la table COMPANIES (entreprises prestataires)
    try {
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .limit(3)

      results.tables.companies = {
        exists: !companiesError,
        error: companiesError?.message,
        purpose: "Table des entreprises prestataires (plombiers, électriciens, etc.)",
        count: companiesData?.length || 0,
        sample_columns: companiesData?.[0] ? Object.keys(companiesData[0]) : null,
        sample_data: companiesData?.[0] || null
      }
    } catch (e) {
      results.tables.companies = { exists: false, error: 'Erreur accès' }
    }

    // 2. Tester la table PROFILES (profils utilisateurs)
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(3)

      results.tables.profiles = {
        exists: !profilesError,
        error: profilesError?.message,
        purpose: "Table des profils utilisateurs (syndics, gestionnaires)",
        count: profilesData?.length || 0,
        sample_columns: profilesData?.[0] ? Object.keys(profilesData[0]) : null,
        sample_data: profilesData?.[0] || null
      }

      // Vérifier spécifiquement votre profil
      if (!profilesError) {
        const { data: myProfile, error: myProfileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)

        results.my_profile = {
          exists: !myProfileError && myProfile && myProfile.length > 0,
          error: myProfileError?.message,
          count: myProfile?.length || 0,
          data: myProfile || null
        }
      }
    } catch (e) {
      results.tables.profiles = { exists: false, error: 'Erreur accès' }
    }

    // 3. Tester d'autres tables possibles pour les utilisateurs
    const possibleUserTables = ['user_profiles', 'users', 'accounts', 'members']
    
    for (const tableName of possibleUserTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)

        results.tables[tableName] = {
          exists: !error,
          error: error?.message,
          purpose: "Table utilisateurs potentielle",
          sample_columns: data?.[0] ? Object.keys(data[0]) : null
        }
      } catch (e) {
        results.tables[tableName] = { exists: false, error: 'Table inexistante' }
      }
    }

    // 4. Tester la table ORGANIZATIONS
    try {
      const { data: orgsData, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .limit(3)

      results.tables.organizations = {
        exists: !orgsError,
        error: orgsError?.message,
        purpose: "Table des organisations (clients/syndics)",
        count: orgsData?.length || 0,
        sample_columns: orgsData?.[0] ? Object.keys(orgsData[0]) : null,
        sample_data: orgsData?.[0] || null
      }
    } catch (e) {
      results.tables.organizations = { exists: false, error: 'Erreur accès' }
    }

    // 5. Résumé et diagnostic
    results.summary = {
      companies_purpose: "Entreprises prestataires (plombiers, électriciens, etc.) qui répondent aux appels d'offres",
      profiles_purpose: "Profils des utilisateurs de l'app (syndics, gestionnaires) qui créent les consultations",
      organizations_purpose: "Organisations/syndics qui gèrent les copropriétés",
      
      current_issue: results.my_profile?.exists ? 
        "Vous avez déjà un profil, le problème est ailleurs" : 
        "Vous n'avez pas de profil utilisateur dans la table 'profiles'",
      
      next_steps: results.my_profile?.exists ? 
        ["Vérifier la logique useAuth", "Vérifier les redirections"] :
        ["Créer votre profil dans la table 'profiles'", "Vérifier que le trigger fonctionne"]
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Erreur real structure:', error)
    return NextResponse.json({
      error: 'Erreur lors de l\'analyse de structure',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}