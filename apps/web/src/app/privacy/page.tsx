import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'

export const metadata = {
  title: 'Politique de confidentialité - Copronomie',
  description: 'Politique de confidentialité et protection des données personnelles de Copronomie.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <h1 className="text-4xl font-bold text-slate-900 mb-8">
              Politique de confidentialité
            </h1>
            
            <p className="text-slate-600 mb-8">
              Dernière mise à jour : 3 septembre 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-700 mb-4">
                Copronomie SAS (« nous », « notre », « nos ») s'engage à protéger la vie privée et les données 
                personnelles de ses utilisateurs. Cette politique de confidentialité décrit comment nous collectons, 
                utilisons, stockons et protégeons vos informations personnelles.
              </p>
              <p className="text-slate-700">
                Cette politique s'applique à tous les utilisateurs de notre plateforme accessible à l'adresse 
                copronomie.fr et est conforme au Règlement Général sur la Protection des Données (RGPD).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Responsable de traitement</h2>
              <div className="bg-slate-50 rounded-lg p-6 mb-4">
                <p className="text-slate-700 mb-2"><strong>Copronomie SAS</strong></p>
                <p className="text-slate-700 mb-2">123 Avenue de la République</p>
                <p className="text-slate-700 mb-2">75011 Paris, France</p>
                <p className="text-slate-700 mb-2">SIRET : [À compléter]</p>
                <p className="text-slate-700 mb-2">Email : dpo@copronomie.fr</p>
                <p className="text-slate-700">Téléphone : 01 23 45 67 89</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Données collectées</h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.1 Données d'identification</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone</li>
                <li>Nom de l'entreprise et fonction</li>
                <li>Adresse professionnelle</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.2 Données d'utilisation</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Informations de connexion (adresse IP, navigateur, système d'exploitation)</li>
                <li>Pages consultées et temps passé sur la plateforme</li>
                <li>Actions effectuées sur la plateforme</li>
                <li>Préférences et paramètres utilisateur</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.3 Données métier</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Informations sur les copropriétés gérées</li>
                <li>Devis uploadés et leurs analyses</li>
                <li>Données de comparaison et rapports générés</li>
                <li>Contrats et informations associées</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">3.4 Données de facturation</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Informations de paiement (traitées par nos prestataires sécurisés)</li>
                <li>Historique des transactions</li>
                <li>Adresses de facturation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Finalités du traitement</h2>
              <p className="text-slate-700 mb-4">
                Nous utilisons vos données personnelles pour les finalités suivantes :
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Fourniture du service :</strong> Gestion de votre compte, analyse des devis, génération de rapports</li>
                <li><strong>Facturation :</strong> Émission des factures, gestion des abonnements, suivi des paiements</li>
                <li><strong>Support client :</strong> Réponse à vos demandes, assistance technique, formation</li>
                <li><strong>Amélioration du service :</strong> Analyse d'usage, développement de nouvelles fonctionnalités</li>
                <li><strong>Communication :</strong> Informations sur le service, mises à jour, newsletter (avec consentement)</li>
                <li><strong>Sécurité :</strong> Détection de fraudes, protection contre les intrusions</li>
                <li><strong>Conformité légale :</strong> Respect des obligations légales et réglementaires</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Base légale du traitement</h2>
              <p className="text-slate-700 mb-4">
                Les traitements de données personnelles sont fondés sur :
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Exécution contractuelle :</strong> Fourniture du service souscrit</li>
                <li><strong>Intérêt légitime :</strong> Amélioration du service, sécurité, analytics</li>
                <li><strong>Consentement :</strong> Newsletter, cookies non essentiels</li>
                <li><strong>Obligation légale :</strong> Conservation des données de facturation, lutte contre la fraude</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Partage des données</h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.1 Prestataires techniques</h3>
              <p className="text-slate-700 mb-4">
                Nous partageons certaines données avec nos prestataires techniques dans le cadre 
                de la fourniture du service :
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Hébergement cloud (AWS/Google Cloud)</li>
                <li>Service d'emailing</li>
                <li>Processeur de paiements</li>
                <li>Outils d'analyse et de monitoring</li>
                <li>Support client</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.2 Garanties</h3>
              <p className="text-slate-700 mb-4">
                Tous nos prestataires sont sélectionnés pour leur conformité RGPD et sont liés 
                par des accords de sous-traitance garantissant la protection de vos données.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.3 Transferts hors UE</h3>
              <p className="text-slate-700">
                En cas de transfert de données hors de l'Union Européenne, nous nous assurons 
                de l'existence de garanties appropriées (décisions d'adéquation, clauses contractuelles types).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Durée de conservation</h2>
              <div className="bg-slate-50 rounded-lg p-6">
                <ul className="list-disc list-inside text-slate-700 space-y-2">
                  <li><strong>Données de compte :</strong> Pendant la durée de l'abonnement + 3 ans</li>
                  <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
                  <li><strong>Données de support :</strong> 3 ans après la résolution du ticket</li>
                  <li><strong>Données d'analyse :</strong> 25 mois maximum (cookies/analytics)</li>
                  <li><strong>Logs de sécurité :</strong> 1 an maximum</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Vos droits</h2>
              <p className="text-slate-700 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-3 mb-4">
                <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> Corriger des données inexactes ou incomplètes</li>
                <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données dans certains cas</li>
                <li><strong>Droit à la limitation :</strong> Restreindre le traitement de vos données</li>
                <li><strong>Droit de portabilité :</strong> Récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition :</strong> S'opposer au traitement pour des motifs légitimes</li>
                <li><strong>Retrait du consentement :</strong> Retirer votre consentement à tout moment</li>
              </ul>
              <p className="text-slate-700">
                Pour exercer ces droits, contactez-nous à : <strong>dpo@copronomie.fr</strong>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Sécurité des données</h2>
              <p className="text-slate-700 mb-4">
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
                pour protéger vos données personnelles :
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Chiffrement des données en transit et au repos (TLS/AES-256)</li>
                <li>Authentification forte et gestion des accès</li>
                <li>Surveillance et monitoring des accès</li>
                <li>Sauvegardes régulières et chiffrées</li>
                <li>Formation du personnel à la sécurité</li>
                <li>Audits de sécurité réguliers</li>
                <li>Plan de réponse aux incidents</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Cookies et technologies similaires</h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">10.1 Types de cookies utilisés</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement de la plateforme</li>
                <li><strong>Cookies de performance :</strong> Analytics et amélioration de l'expérience</li>
                <li><strong>Cookies de préférences :</strong> Sauvegarde de vos paramètres</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">10.2 Gestion des cookies</h3>
              <p className="text-slate-700">
                Vous pouvez à tout moment modifier vos préférences de cookies via les paramètres 
                de votre compte ou les paramètres de votre navigateur.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Mineurs</h2>
              <p className="text-slate-700">
                Notre service n'est pas destiné aux mineurs de moins de 16 ans. Nous ne collectons 
                pas sciemment de données personnelles d'enfants de moins de 16 ans.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Modifications</h2>
              <p className="text-slate-700 mb-4">
                Nous pouvons modifier cette politique de confidentialité à tout moment. 
                Les modifications importantes seront communiquées par email et/ou notification 
                sur la plateforme.
              </p>
              <p className="text-slate-700">
                Nous vous encourageons à consulter régulièrement cette page pour rester informé 
                de la façon dont nous protégeons vos informations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Réclamations</h2>
              <p className="text-slate-700 mb-4">
                Si vous estimez que le traitement de vos données personnelles constitue une violation 
                de la réglementation, vous avez le droit d'introduire une réclamation auprès de 
                l'autorité de contrôle compétente.
              </p>
              <div className="bg-slate-50 rounded-lg p-6">
                <p className="text-slate-700 mb-2"><strong>CNIL (Commission Nationale de l'Informatique et des Libertés)</strong></p>
                <p className="text-slate-700 mb-2">3 Place de Fontenoy - TSA 80715</p>
                <p className="text-slate-700 mb-2">75334 Paris Cedex 07</p>
                <p className="text-slate-700">Site web : www.cnil.fr</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Contact</h2>
              <p className="text-slate-700 mb-4">
                Pour toute question concernant cette politique de confidentialité ou le traitement 
                de vos données personnelles, vous pouvez nous contacter :
              </p>
              <div className="bg-slate-50 rounded-lg p-6">
                <p className="text-slate-700 mb-2"><strong>Délégué à la Protection des Données</strong></p>
                <p className="text-slate-700 mb-2">Email : dpo@copronomie.fr</p>
                <p className="text-slate-700 mb-2">Courrier : Copronomie SAS - DPO</p>
                <p className="text-slate-700 mb-2">123 Avenue de la République</p>
                <p className="text-slate-700">75011 Paris, France</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <PublicFooter />
    </div>
  )
}