import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const results: any = {}

    // Tester contracts
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .limit(1)
      
      if (error) {
        results.contracts_error = error.message
      } else {
        results.contracts = {
          status: 'EXISTS',
          sample_columns: data && data.length > 0 ? Object.keys(data[0]) : 'No data to show columns'
        }
      }
    } catch (e) {
      results.contracts_error = e instanceof Error ? e.message : 'Unknown error'
    }

    // Tester consultations
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .limit(1)
      
      if (error) {
        results.consultations_error = error.message
      } else {
        results.consultations = {
          status: 'EXISTS',
          sample_columns: data && data.length > 0 ? Object.keys(data[0]) : 'No data to show columns'
        }
      }
    } catch (e) {
      results.consultations_error = e instanceof Error ? e.message : 'Unknown error'
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({
      error: 'Erreur lors du test des colonnes',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}