import type { SupabaseClient } from './client'
import type { UserRegistrationInput, UserLoginInput } from '@copronomie/shared'

export class AuthService {
  constructor(private supabase: SupabaseClient) {}

  async signUp(credentials: UserRegistrationInput) {
    const { email, password, nom, prenom, role } = credentials
    
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nom,
          prenom,
          role
        }
      }
    })

    if (error) throw error

    // Créer le profil utilisateur
    if (data.user) {
      const { error: profileError } = await (this.supabase as any)
        .from('user_profiles')
        .insert({
          id: data.user.id,
          email,
          nom,
          prenom,
          role,
          coproprietes: []
        })
      
      if (profileError) throw profileError
    }

    return data
  }

  async signIn(credentials: UserLoginInput) {
    const { data, error } = await this.supabase.auth.signInWithPassword(credentials)
    
    if (error) throw error

    // Mettre à jour last_login
    if (data.user) {
      await (this.supabase as any)
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id)
    }

    return data
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    if (error) throw error
    return user
  }

  async getUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  }

  async updateUserProfile(userId: string, updates: Partial<{
    nom: string
    prenom: string
    role: 'admin' | 'syndic' | 'conseil_syndical'
  }>) {
    const { data, error } = await (this.supabase as any)
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    
    if (error) throw error
  }

  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
  }

  // Écouter les changements d'authentification
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }
}