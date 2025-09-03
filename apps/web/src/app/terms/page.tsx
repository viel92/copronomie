import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'

export const metadata = {
  title: 'Conditions générales d\'utilisation - Copronomie',
  description: 'Conditions générales d\'utilisation de la plateforme Copronomie.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <h1 className="text-4xl font-bold text-slate-900 mb-8">
              Conditions générales d'utilisation
            </h1>
            
            <p className="text-slate-600 mb-8">
              Dernière mise à jour : 3 septembre 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Objet</h2>
              <p className="text-slate-700 mb-4">
                Les présentes conditions générales d'utilisation (« CGU ») régissent l'accès et l'utilisation 
                de la plateforme Copronomie, service SaaS de gestion et d'analyse de devis de copropriété 
                proposé par la société Copronomie SAS.
              </p>
              <p className="text-slate-700">
                L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes CGU.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Définitions</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Plateforme :</strong> Le service SaaS Copronomie accessible via l'URL copronomie.fr</li>
                <li><strong>Utilisateur :</strong> Toute personne physique ou morale utilisant la plateforme</li>
                <li><strong>Client :</strong> Utilisateur ayant souscrit à un abonnement payant</li>
                <li><strong>Données :</strong> Toutes informations saisies ou uploadées sur la plateforme</li>
                <li><strong>Services :</strong> L'ensemble des fonctionnalités proposées par la plateforme</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Accès aux services</h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.1 Inscription</h3>
              <p className="text-slate-700 mb-4">
                L'accès aux services nécessite la création d'un compte utilisateur. L'utilisateur s'engage 
                à fournir des informations exactes et à les maintenir à jour.
              </p>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.2 Identifiants</h3>
              <p className="text-slate-700 mb-4">
                L'utilisateur est seul responsable de la confidentialité de ses identifiants et de toutes 
                les actions effectuées avec son compte.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.3 Suspension</h3>
              <p className="text-slate-700">
                Copronomie se réserve le droit de suspendre ou fermer un compte en cas de non-respect 
                des présentes CGU ou de non-paiement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Utilisation des services</h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">4.1 Usage autorisé</h3>
              <p className="text-slate-700 mb-4">
                La plateforme est destinée exclusivement à l'analyse et la gestion de devis de copropriété 
                dans un cadre professionnel légal.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">4.2 Obligations de l'utilisateur</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Respecter la législation applicable</li>
                <li>Ne pas porter atteinte au système ou aux données d'autres utilisateurs</li>
                <li>Ne pas utiliser la plateforme à des fins illicites</li>
                <li>Respecter les droits de propriété intellectuelle</li>
                <li>Ne pas tenter de contourner les mesures de sécurité</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">4.3 Interdictions</h3>
              <p className="text-slate-700">
                Sont notamment interdits : la revente des services, l'utilisation de robots ou scripts 
                automatisés, la diffusion de contenus illicites ou malveillants.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Tarification et facturation</h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.1 Abonnements</h3>
              <p className="text-slate-700 mb-4">
                Les tarifs sont indiqués sur la page pricing de la plateforme. Ils s'entendent hors taxes 
                et sont susceptibles de modification avec un préavis de 30 jours.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.2 Paiement</h3>
              <p className="text-slate-700 mb-4">
                Le paiement s'effectue par avance, mensuellement ou annuellement selon l'abonnement choisi. 
                En cas de non-paiement, l'accès aux services peut être suspendu.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.3 Résiliation</h3>
              <p className="text-slate-700">
                L'utilisateur peut résilier son abonnement à tout moment. La résiliation prend effet 
                à la fin de la période en cours, sans remboursement prorata.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Protection des données</h2>
              <p className="text-slate-700 mb-4">
                Le traitement des données personnelles fait l'objet d'une politique de confidentialité 
                spécifique, consultable sur la plateforme et conforme au RGPD.
              </p>
              <p className="text-slate-700">
                L'utilisateur conserve la propriété de ses données et peut les exporter ou demander 
                leur suppression conformément à la réglementation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Propriété intellectuelle</h2>
              <p className="text-slate-700 mb-4">
                La plateforme, son code source, sa documentation et tous éléments la composant sont 
                protégés par les droits de propriété intellectuelle de Copronomie.
              </p>
              <p className="text-slate-700">
                Aucune licence n'est accordée à l'utilisateur sur ces éléments, hormis le droit d'usage 
                dans le cadre du service souscrit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Responsabilité et garanties</h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">8.1 Disponibilité</h3>
              <p className="text-slate-700 mb-4">
                Copronomie s'engage à fournir un service avec un taux de disponibilité de 99,5% sur une base 
                mensuelle, hors opérations de maintenance programmées.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">8.2 Limitation de responsabilité</h3>
              <p className="text-slate-700 mb-4">
                La responsabilité de Copronomie est limitée aux dommages directs et ne saurait excéder 
                le montant des sommes versées par l'utilisateur au cours des 12 derniers mois.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">8.3 Sauvegarde</h3>
              <p className="text-slate-700">
                Il appartient à l'utilisateur de procéder à ses propres sauvegardes. Copronomie effectue 
                des sauvegardes régulières mais ne garantit pas la récupération des données en cas de sinistre.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Support et maintenance</h2>
              <p className="text-slate-700 mb-4">
                Un support technique est fourni selon les modalités définies pour chaque type d'abonnement. 
                Des opérations de maintenance peuvent occasionner des interruptions de service.
              </p>
              <p className="text-slate-700">
                Les mises à jour et évolutions de la plateforme sont déployées automatiquement sans 
                préavis, sauf changement majeur nécessitant une communication préalable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Force majeure</h2>
              <p className="text-slate-700">
                Copronomie ne saurait être tenue responsable de l'inexécution de ses obligations en cas 
                de force majeure telle que définie par la jurisprudence française.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Modification des CGU</h2>
              <p className="text-slate-700 mb-4">
                Copronomie se réserve le droit de modifier les présentes CGU à tout moment. 
                Les utilisateurs seront informés des modifications par email ou notification sur la plateforme.
              </p>
              <p className="text-slate-700">
                La poursuite de l'utilisation après notification vaut acceptation des nouvelles conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Droit applicable et juridiction</h2>
              <p className="text-slate-700 mb-4">
                Les présentes CGU sont soumises au droit français. En cas de litige, les parties 
                s'efforceront de trouver une solution amiable.
              </p>
              <p className="text-slate-700">
                À défaut, les tribunaux de Paris seront seuls compétents, y compris en cas de 
                pluralité de défendeurs ou d'appel en garantie.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Contact</h2>
              <p className="text-slate-700 mb-4">
                Pour toute question relative aux présentes CGU, vous pouvez nous contacter :
              </p>
              <div className="bg-slate-50 rounded-lg p-6">
                <p className="text-slate-700 mb-2"><strong>Copronomie SAS</strong></p>
                <p className="text-slate-700 mb-2">123 Avenue de la République</p>
                <p className="text-slate-700 mb-2">75011 Paris, France</p>
                <p className="text-slate-700 mb-2">Email : legal@copronomie.fr</p>
                <p className="text-slate-700">Téléphone : 01 23 45 67 89</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  )
}