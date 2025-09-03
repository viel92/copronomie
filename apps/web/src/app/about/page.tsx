import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'
import Link from 'next/link'

export const metadata = {
  title: 'À propos - Copronomie',
  description: 'Découvrez l\'équipe et la mission derrière Copronomie, la plateforme SaaS qui révolutionne la gestion des devis de copropriété.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-6">
              Notre mission : simplifier la gestion de copropriété
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Nous créons des solutions intelligentes pour aider les gestionnaires de copropriété 
              à prendre de meilleures décisions, plus rapidement.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Notre histoire
              </h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Copronomie est née d'un constat simple : la gestion des appels d'offres en copropriété 
                  est chronophage, complexe et souvent source d'erreurs. Les syndics et gestionnaires 
                  passent des heures à analyser manuellement des devis, à comparer des prestations 
                  hétérogènes et à justifier leurs choix.
                </p>
                <p>
                  Forts de notre expérience dans l'immobilier et la technologie, nous avons développé 
                  une plateforme qui automatise ces processus grâce à l'intelligence artificielle. 
                  Notre objectif : faire gagner du temps aux professionnels tout en améliorant 
                  la qualité des décisions prises.
                </p>
                <p>
                  Aujourd'hui, Copronomie accompagne des dizaines de gestionnaires dans l'optimisation 
                  de leurs processus de sélection de prestataires, avec des économies moyennes de 20 à 30% 
                  sur leurs coûts de fonctionnement.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Nos valeurs
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Transparence</h4>
                  <p className="text-slate-600">
                    Nous croyons en la transparence totale des processus de sélection et des critères de décision.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Innovation</h4>
                  <p className="text-slate-600">
                    Nous utilisons les dernières technologies pour résoudre des problèmes concrets du secteur.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Accompagnement</h4>
                  <p className="text-slate-600">
                    Nous accompagnons nos clients dans leur transformation digitale avec un support personnalisé.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-slate-900 rounded-2xl p-8 mb-16 text-white">
            <h2 className="text-3xl font-bold text-center mb-8">
              Copronomie en chiffres
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
                <div className="text-slate-300">Devis analysés</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">25%</div>
                <div className="text-slate-300">Économies moyennes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">2h</div>
                <div className="text-slate-300">Temps gagné par consultation</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-400 mb-2">98%</div>
                <div className="text-slate-300">Taux de satisfaction</div>
              </div>
            </div>
          </div>

          {/* Technology Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-white border border-slate-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Notre technologie
              </h3>
              <div className="space-y-4 text-slate-600">
                <p>
                  Copronomie utilise des technologies de pointe pour analyser et comparer vos devis :
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 mr-3">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Intelligence artificielle pour l'extraction de données PDF</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 mr-3">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Algorithmes de comparaison automatisée</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 mr-3">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Sécurité renforcée et conformité RGPD</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 mr-3">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Interface intuitive et responsive</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Pourquoi nous choisir ?
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Expertise métier</h4>
                  <p className="text-slate-600">
                    Notre équipe connaît parfaitement les enjeux de la gestion de copropriété.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Solution clé en main</h4>
                  <p className="text-slate-600">
                    Implémentation rapide sans formation complexe ni changement d'habitudes.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Support réactif</h4>
                  <p className="text-slate-600">
                    Une équipe dédiée pour vous accompagner dans votre utilisation quotidienne.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Évolution continue</h4>
                  <p className="text-slate-600">
                    Nous améliorons constamment la plateforme selon vos retours et besoins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-blue-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">
              Prêt à transformer votre gestion de copropriété ?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Rejoignez les gestionnaires qui ont déjà fait le choix de l'innovation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  )
}