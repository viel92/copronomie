'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@copronomie/ui'
import { Mail, Lock, User, Building } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    coproName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            copro_name: formData.coproName,
          }
        }
      })

      if (signUpError) {
        setError(signUpError.message)
      } else {
        router.push('/auth/login')
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                label="Prénom"
                placeholder="Jean"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                leftIcon={<User className="h-4 w-4 text-slate-400" />}
                required
              />
              
              <Input
                type="text"
                label="Nom"
                placeholder="Dupont"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
            
            <Input
              type="email"
              label="Email"
              placeholder="nom@exemple.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
              required
            />
            
            <Input
              type="password"
              label="Mot de passe"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
              helperText="Minimum 6 caractères"
              required
            />
            
            <Input
              type="text"
              label="Nom de la copropriété"
              placeholder="Résidence Les Jardins"
              value={formData.coproName}
              onChange={(e) => setFormData({...formData, coproName: e.target.value})}
              leftIcon={<Building className="h-4 w-4 text-slate-400" />}
              required
            />

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              S'inscrire
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Déjà un compte ? </span>
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}