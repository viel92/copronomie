'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']
type Organization = Database['public']['Tables']['organizations']['Row']

interface AuthUser extends User {
  profile?: Profile & {
    organization?: Organization
  }
}

interface AuthState {
  user: AuthUser | null
  profile: (Profile & { organization?: Organization }) | null
  loading: boolean
  isAuthenticated: boolean
  isOwner: boolean
  isAdmin: boolean
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<(Profile & { organization?: Organization }) | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user && mounted) {
          await fetchUserProfile(session.user)
        } else if (mounted) {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error)
        if (mounted) {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      }
    }

    const fetchUserProfile = async (user: User) => {
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select(`
            *,
            organization:organizations(*)
          `)
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Erreur lors de la récupération du profil:', error)
          if (mounted) {
            setUser(user)
            setProfile(null)
            setLoading(false)
          }
          return
        }

        if (mounted) {
          setUser(user)
          setProfile(profileData as Profile & { organization?: Organization })
          setLoading(false)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error)
        if (mounted) {
          setUser(user)
          setProfile(null)
          setLoading(false)
        }
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user)
        } else if (event === 'SIGNED_OUT') {
          if (mounted) {
            setUser(null)
            setProfile(null)
            setLoading(false)
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const isOwner = profile?.role === 'owner'
  const isAdmin = profile?.role === 'admin' || profile?.role === 'owner'

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isOwner,
    isAdmin
  }
}