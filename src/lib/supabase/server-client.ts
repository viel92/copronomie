import { createServerClient } from '@supabase/ssr'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function createApiClient(request?: NextRequest) {
  if (request) {
    // Pour les API routes avec NextRequest
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set() {
            // Les API routes ne peuvent pas définir de cookies
          },
          remove() {
            // Les API routes ne peuvent pas supprimer de cookies
          },
        },
      }
    )
  } else {
    // Pour les pages et composants serveur
    const cookieStore = await cookies()
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: any) {
            cookieStore.delete(name)
          },
        },
      }
    )
  }
}