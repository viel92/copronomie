'use client'

import Link from 'next/link'
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SetupErrorPage() {
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  const handleRetry = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex flex-col items-center text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Erreur de configuration
            </h2>
            
            <p className="mt-2 text-sm text-gray-600">
              Nous n'avons pas pu configurer automatiquement votre profil utilisateur.
              Cela peut être dû à des restrictions de sécurité de la base de données.
            </p>

            <div className="mt-6 space-y-4 w-full">
              <button
                onClick={handleRetry}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Réessayer
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Se déconnecter
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-md">
              <h3 className="text-sm font-medium text-yellow-800">
                Solutions alternatives
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>• Contactez votre administrateur</p>
                <p>• Vérifiez les permissions de base de données</p>
                <p>• Essayez de vous reconnecter</p>
              </div>
            </div>

            <div className="mt-4">
              <Link 
                href="/contact" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Contacter le support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}