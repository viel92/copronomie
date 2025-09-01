import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Copronomie
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            La plateforme SaaS pour optimiser la gestion de vos devis de copropriété avec l'intelligence artificielle.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Link
              href="/auth/register"
              className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="/auth/login"
              className="group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-none ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300"
            >
              Se connecter
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-3 lg:gap-x-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-lg font-semibold text-slate-900">Analyse automatique</h3>
              <p className="mt-2 text-sm text-slate-600">
                Upload vos devis PDF et obtenez une analyse détaillée instantanée grâce à l'IA.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-lg font-semibold text-slate-900">Comparaison intelligente</h3>
              <p className="mt-2 text-sm text-slate-600">
                Comparez automatiquement les devis et identifiez les meilleures offres.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-lg font-semibold text-slate-900">Gestion multi-copropriétés</h3>
              <p className="mt-2 text-sm text-slate-600">
                Gérez toutes vos copropriétés depuis une seule interface centralisée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
