import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 1. Lister toutes les tables publiques
    const { data: tables, error: tablesError } = await supabase
      .rpc('exec_sql', { 
        sql: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name;
        `
      })
      .single()

    if (tablesError) {
      // Essayons une approche alternative
      console.log('Erreur RPC, essayons une requête directe...')
      
      // Test direct sur différentes tables possibles
      const testResults: any = {}
      
      // Tester 'profiles'
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .limit(0)
        testResults.profiles = profilesError ? profilesError.message : 'EXISTS'
      } catch (e) {
        testResults.profiles = 'TABLE_NOT_FOUND'
      }
      
      // Tester 'user_profiles' 
      try {
        const { data: userProfilesData, error: userProfilesError } = await supabase
          .from('user_profiles')
          .select('*')
          .limit(0)
        testResults.user_profiles = userProfilesError ? userProfilesError.message : 'EXISTS'
      } catch (e) {
        testResults.user_profiles = 'TABLE_NOT_FOUND'
      }
      
      // Tester 'organizations'
      try {
        const { data: orgsData, error: orgsError } = await supabase
          .from('organizations')
          .select('*')
          .limit(0)
        testResults.organizations = orgsError ? orgsError.message : 'EXISTS'
      } catch (e) {
        testResults.organizations = 'TABLE_NOT_FOUND'
      }
      
      // Tester d'autres tables possibles
      const possibleTables = ['consultations', 'coproprietes', 'companies', 'contracts', 'comparisons']
      for (const table of possibleTables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(0)
          testResults[table] = error ? error.message : 'EXISTS'
        } catch (e) {
          testResults[table] = 'TABLE_NOT_FOUND'
        }
      }
      
      return NextResponse.json({
        method: 'direct_test',
        tables: testResults,
        note: 'Tables testées directement car RPC non disponible'
      })
    }

    return NextResponse.json({
      method: 'rpc_query',
      tables: tables || [],
      raw: tables
    })

  } catch (error) {
    console.error('Erreur debug tables:', error)
    return NextResponse.json({
      error: 'Erreur lors de la vérification des tables',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}