import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
              Optimisez vos <span className="text-blue-600">devis de copropriété</span> avec l'IA
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-600">
              Analysez, comparez et gérez tous vos devis automatiquement. Gagnez du temps et de l'argent avec notre plateforme intelligente.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/contact"
                className="border border-slate-300 text-slate-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Demander une démo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Pourquoi choisir Copronomie ?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Une solution complète pour transformer la gestion de vos appels d'offres
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Analyse automatique</h3>
              <p className="text-slate-600">
                Uploadez vos devis PDF et obtenez une analyse détaillée instantanée grâce à l'IA. Extraction automatique des prix, prestations et conditions.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Comparaison intelligente</h3>
              <p className="text-slate-600">
                Comparez automatiquement les devis et identifiez les meilleures offres. Tableaux comparatifs détaillés et recommandations IA.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Gestion multi-copropriétés</h3>
              <p className="text-slate-600">
                Gérez toutes vos copropriétés depuis une interface centralisée. Suivi des contrats, alertes d'expiration et historique complet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Économisez jusqu'à 30% sur vos coûts
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 mr-4">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Gain de temps considérable</h3>
                    <p className="text-slate-600">Fini les heures passées à analyser manuellement les devis</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 mr-4">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Meilleure prise de décision</h3>
                    <p className="text-slate-600">Données précises et comparaisons objectives pour choisir</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 mr-4">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Réduction des erreurs</h3>
                    <p className="text-slate-600">L'IA détecte les incohérences et anomalies</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Prêt à commencer ?</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <span className="text-slate-600">Essai gratuit 14 jours</span>
                  <span className="text-green-600 font-semibold">Inclus</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-200">
                  <span className="text-slate-600">Support client dédié</span>
                  <span className="text-green-600 font-semibold">Inclus</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-600">Configuration sur mesure</span>
                  <span className="text-green-600 font-semibold">Inclus</span>
                </div>
              </div>
              
              <Link
                href="/auth/register"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6 block text-center"
              >
                Démarrer maintenant
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}