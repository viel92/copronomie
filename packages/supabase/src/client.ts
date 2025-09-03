import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

// URL et clé publique Supabase (à définir dans les variables d'environnement)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes')
}

// Client Supabase pour les composants côté client
export const createSupabaseClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Client Supabase pour les composants côté client dans Next.js
export const createSupabaseComponentClient = () => {
  return createClientComponentClient<Database>()
}

// Client Supabase pour les composants côté serveur dans Next.js
export const createSupabaseServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Client Supabase pour les API routes dans Next.js
export const createSupabaseRouteHandlerClient = (request: Request) => {
  const cookieStore = cookies()
  return createRouteHandlerClient<Database>({ cookies: () => cookieStore })
}

// Client Supabase administrateur (utilise la service key)
export const createSupabaseAdminClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY manquante')
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Instance par défaut pour usage simple
export const supabase = createSupabaseClient()

// Types utilitaires
export type SupabaseClient = ReturnType<typeof createSupabaseClient>
export type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>
export type SupabaseAdminClient = ReturnType<typeof createSupabaseAdminClient>