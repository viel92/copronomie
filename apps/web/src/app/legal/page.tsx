import PublicHeader from '@/components/PublicHeader'
import PublicFooter from '@/components/PublicFooter'

export const metadata = {
  title: 'Mentions légales - Copronomie',
  description: 'Mentions légales de la plateforme Copronomie.',
}

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none">
            <h1 className="text-4xl font-bold text-slate-900 mb-8">
              Mentions légales
            </h1>
            
            <p className="text-slate-600 mb-8">
              Dernière mise à jour : 3 septembre 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Éditeur du site</h2>
              <div className="bg-slate-50 rounded-lg p-6">
                <p className="text-slate-700 mb-2"><strong>Raison sociale :</strong> Copronomie SAS</p>
                <p className="text-slate-700 mb-2"><strong>Forme juridique :</strong> Société par Actions Simplifiée</p>
                <p className="text-slate-700 mb-2"><strong>Capital social :</strong> 10 000 € (à compléter)</p>
                <p className="text-slate-700 mb-2"><strong>SIRET :</strong> [À compléter]</p>
                <p className="text-slate-700 mb-2"><strong>RCS :</strong> Paris [À compléter]</p>
                <p className="text-slate-700 mb-2"><strong>TVA intracommunautaire :</strong> FR [À compléter]</p>
                <p className="text-slate-700 mb-2"><strong>Code APE :</strong> 6201Z - Programmation informatique</p>
                <br />
                <p className="text-slate-700 mb-2"><strong>Siège social :</strong></p>
                <p className="text-slate-700 mb-2">123 Avenue de la République</p>
                <p className="text-slate-700 mb-2">75011 Paris, France</p>
                <br />
                <p className="text-slate-700 mb-2"><strong>Téléphone :</strong> 01 23 45 67 89</p>
                <p className="text-slate-700 mb-2"><strong>Email :</strong> contact@copronomie.fr</p>
                <br />
                <p className="text-slate-700 mb-2"><strong>Représentant légal :</strong> [Nom du dirigeant]</p>
                <p className="text-slate-700"><strong>Qualité :</strong> Président</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Directeur de la publication</h2>
              <p className="text-slate-700 mb-4">
                Le directeur de la publication du site copronomie.fr est : <strong>[Nom du dirigeant]</strong>, 
                en sa qualité de Président de Copronomie SAS.
              </p>
              <p className="text-slate-700">
                Contact : direction@copronomie.fr
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Hébergement</h2>
              <div className="bg-slate-50 rounded-lg p-6">
                <p className="text-slate-700 mb-2"><strong>Hébergeur principal :</strong> Amazon Web Services (AWS)</p>
                <p className="text-slate-700 mb-2"><strong>Adresse :</strong> Amazon Web Services EMEA SARL</p>
                <p className="text-slate-700 mb-2">38 Avenue John F. Kennedy</p>
                <p className="text-slate-700 mb-2">L-1855 Luxembourg</p>
                <p className="text-slate-700 mb-2"><strong>Site web :</strong> aws.amazon.com</p>
                <br />
                <p className="text-slate-700 mb-2"><strong>CDN et services :</strong> Cloudflare, Inc.</p>
                <p className="text-slate-700 mb-2">101 Townsend St</p>
                <p className="text-slate-700 mb-2">San Francisco, CA 94107, États-Unis</p>
                <p className="text-slate-700"><strong>Site web :</strong> cloudflare.com</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Conception et développement</h2>
              <p className="text-slate-700 mb-4">
                Le site copronomie.fr a été conçu et développé par l'équipe technique de Copronomie SAS.
              </p>
              <p className="text-slate-700">
                Pour toute question technique : tech@copronomie.fr
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Propriété intellectuelle</h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.1 Droits d'auteur</h3>
              <p className="text-slate-700 mb-4">
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur 
                et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour 
                les documents téléchargeables et les représentations iconographiques et photographiques.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.2 Marques</h3>
              <p className="text-slate-700 mb-4">
                « Copronomie » est une marque de Copronomie SAS. Toute reproduction ou représentation totale 
                ou partielle de cette marque, sans autorisation expresse et préalable de Copronomie SAS, 
                est prohibée et constituerait une contrefaçon.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">5.3 Contenus utilisateurs</h3>
              <p className="text-slate-700">
                Les utilisateurs conservent tous leurs droits de propriété intellectuelle sur les contenus 
                qu'ils soumettent sur la plateforme. En utilisant nos services, ils nous accordent une licence 
                non exclusive pour traiter ces contenus dans le cadre de la fourniture du service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Responsabilité</h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.1 Contenu du site</h3>
              <p className="text-slate-700 mb-4">
                Copronomie SAS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées 
                sur ce site. Cependant, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité 
                des informations mises à disposition sur ce site.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.2 Utilisation du site</h3>
              <p className="text-slate-700 mb-4">
                L'utilisateur reconnaît avoir pris connaissance des présentes mentions légales et s'engage 
                à les respecter. L'utilisation du site implique l'acceptation pleine et entière des 
                conditions énoncées dans ces mentions légales.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3">6.3 Liens hypertextes</h3>
              <p className="text-slate-700">
                Le site peut contenir des liens vers d'autres sites web. Copronomie SAS n'exerce aucun 
                contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou leur 
                fonctionnement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Protection des données personnelles</h2>
              <p className="text-slate-700 mb-4">
                Copronomie SAS attache une grande importance à la protection de vos données personnelles. 
                Le traitement de ces données est réalisé en conformité avec le Règlement Général sur 
                la Protection des Données (RGPD) et la loi Informatique et Libertés.
              </p>
              <p className="text-slate-700">
                Pour plus d'informations, consultez notre 
                <a href="/privacy" className="text-blue-600 hover:text-blue-800 ml-1">
                  Politique de Confidentialité
                </a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Cookies</h2>
              <p className="text-slate-700 mb-4">
                Ce site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des 
                statistiques de visite. En continuant à naviguer sur ce site, vous acceptez l'utilisation 
                de ces cookies.
              </p>
              <p className="text-slate-700">
                Vous pouvez à tout moment modifier vos préférences de cookies via les paramètres de 
                votre navigateur ou notre interface de gestion des cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Droit applicable</h2>
              <p className="text-slate-700 mb-4">
                Les présentes mentions légales sont soumises au droit français. En cas de litige, 
                les tribunaux français seront seuls compétents.
              </p>
              <p className="text-slate-700">
                En cas de traduction des présentes mentions légales en une ou plusieurs langues, 
                seul le texte français ferait foi en cas de litige.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Médiation</h2>
              <p className="text-slate-700 mb-4">
                Conformément à l'article L.616-1 du Code de la consommation, nous vous informons 
                qu'en cas de litige, vous pouvez recourir gratuitement au service de médiation 
                de la consommation suivant :
              </p>
              <div className="bg-slate-50 rounded-lg p-6">
                <p className="text-slate-700 mb-2"><strong>Médiateur :</strong> [À définir selon le secteur]</p>
                <p className="text-slate-700 mb-2"><strong>Site web :</strong> [URL du médiateur]</p>
                <p className="text-slate-700"><strong>Adresse :</strong> [Adresse du médiateur]</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Accessibilité</h2>
              <p className="text-slate-700 mb-4">
                Copronomie SAS s'efforce de rendre son site accessible au plus grand nombre, 
                conformément aux standards d'accessibilité web en vigueur.
              </p>
              <p className="text-slate-700">
                Si vous rencontrez des difficultés pour accéder à certains contenus ou fonctionnalités, 
                n'hésitez pas à nous contacter à : accessibilite@copronomie.fr
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Modifications</h2>
              <p className="text-slate-700 mb-4">
                Copronomie SAS se réserve le droit de modifier à tout moment les présentes mentions légales. 
                Les modifications entrent en vigueur dès leur publication sur le site.
              </p>
              <p className="text-slate-700">
                Il vous appartient de consulter régulièrement la dernière version des mentions légales 
                disponible sur le site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Contact</h2>
              <p className="text-slate-700 mb-4">
                Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
              </p>
              <div className="bg-slate-50 rounded-lg p-6">
                <p className="text-slate-700 mb-2"><strong>Par email :</strong> legal@copronomie.fr</p>
                <p className="text-slate-700 mb-2"><strong>Par téléphone :</strong> 01 23 45 67 89</p>
                <p className="text-slate-700 mb-2"><strong>Par courrier :</strong></p>
                <p className="text-slate-700 mb-2">Copronomie SAS</p>
                <p className="text-slate-700 mb-2">Service Juridique</p>
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