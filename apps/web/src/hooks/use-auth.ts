'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

// Définition basée sur le vrai schéma SQL
interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  organization_id: string
  role: 'owner' | 'admin' | 'member'
  avatar_url: string | null
  created_at: string
  updated_at: string
  organization?: Organization
}

interface Organization {
  id: string
  name: string
  slug: string
  plan: string
  max_devis: number
  settings: any
  subscription_status: string
}

interface AuthUser extends User {
  profile?: Profile
}

interface AuthState {
  user: AuthUser | null
  profile: Profile | null
  loading: boolean
  isAuthenticated: boolean
  isOwner: boolean
  isAdmin: boolean
  currentCopro: Organization | null
  userCopros: Organization[]
  switchCopro: (coproId: string) => void
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
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
          console.warn('❌ PROFIL NON TROUVÉ - CRÉATION AUTOMATIQUE:', error.message)
          console.log('🚀 LANCEMENT createUserProfile pour:', user.id)
          // Essayer de créer le profil automatiquement
          await createUserProfile(user)
          return
        }

        if (mounted) {
          setUser(user)
          setProfile(profileData)
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

    const createUserProfile = async (user: User) => {
      try {
        console.log('🔥 DÉBUT CRÉATION PROFIL POUR:', user.id, user.email)
        const userMetadata = user.user_metadata || {}
        
        // Déterminer le nom de l'organisation depuis les métadonnées
        const orgName = userMetadata.copro_name || userMetadata.company_name || `Organisation de ${user.email?.split('@')[0] || 'utilisateur'}`
        const orgSlug = `org-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        
        console.log('🏢 Création de l\'organisation:', orgName)
        
        // Étape 1: Créer l'organisation via l'API pour contourner RLS
        const orgResponse = await fetch('/api/debug/create-organization', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: orgName,
            slug: orgSlug,
            user_id: user.id
          })
        })
        
        if (!orgResponse.ok) {
          throw new Error(`Erreur API organisation: ${orgResponse.status}`)
        }
        
        const { organization: newOrg } = await orgResponse.json()
        console.log('✅ Organisation créée:', newOrg.id)

        // Étape 2: Créer le profil via l'API
        const profileResponse = await fetch('/api/debug/create-user-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            first_name: userMetadata.first_name || null,
            last_name: userMetadata.last_name || null,
            organization_id: newOrg.id,
            role: 'owner'
          })
        })
        
        if (!profileResponse.ok) {
          throw new Error(`Erreur API profil: ${profileResponse.status}`)
        }
        
        const { profile: newProfile } = await profileResponse.json()
        console.log('✅ Profil créé:', newProfile.id)
        
        // Récupérer le profil complet avec l'organisation
        const { data: completeProfile, error: fetchError } = await supabase
          .from('profiles')
          .select(`
            *,
            organization:organizations(*)
          `)
          .eq('id', user.id)
          .single()

        if (fetchError) {
          console.warn('Impossible de récupérer le profil complet, utilisation des données partielles')
          const profileWithOrg = {
            ...newProfile,
            organization: newOrg
          }
          
          if (mounted) {
            setUser(user)
            setProfile(profileWithOrg)
            setLoading(false)
          }
        } else {
          if (mounted) {
            setUser(user)
            setProfile(completeProfile)
            setLoading(false)
          }
        }
        
        console.log('🎉 Utilisateur configuré avec succès!')
        
      } catch (error) {
        console.error('❌ Erreur lors de la création du profil:', error)
        
        // En cas d'erreur, on essaie quand même de récupérer un profil existant
        // (au cas où il aurait été créé par un autre moyen)
        try {
          const { data: existingProfile, error: existingError } = await supabase
            .from('profiles')
            .select(`
              *,
              organization:organizations(*)
            `)
            .eq('id', user.id)
            .single()

          if (!existingError && existingProfile) {
            console.log('📋 Profil existant trouvé, utilisation de celui-ci')
            if (mounted) {
              setUser(user)
              setProfile(existingProfile)
              setLoading(false)
            }
            return
          }
        } catch (e) {
          console.log('Aucun profil existant trouvé')
        }
        
        // Si vraiment tout échoue, déconnecter l'utilisateur avec message d'erreur
        if (mounted) {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
        
        alert('Impossible de créer votre profil automatiquement. Veuillez contacter le support.')
        await supabase.auth.signOut()
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

  // Fonction pour changer d'organisation (pour multi-tenant)
  const switchCopro = (coproId: string) => {
    // TODO: Implémenter le changement d'organisation
    console.log('Switch to copro:', coproId)
  }

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isOwner,
    isAdmin,
    // Retourne l'organisation du profil
    currentCopro: profile?.organization || null,
    userCopros: profile?.organization ? [profile.organization] : [],
    switchCopro
  }
}