import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-violet-700">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link 
          to="/auth" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </Link>

        <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
          <h1 className="text-3xl font-bold text-white mb-6">Politique de confidentialité</h1>
          
          <div className="space-y-6 text-white/90">
            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">1. Collecte des données</h2>
              <p className="leading-relaxed">
                Nous collectons les informations que vous nous fournissez lors de votre inscription : 
                nom, adresse email, et informations de paiement. Nous collectons également des données 
                d'utilisation pour améliorer nos services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">2. Utilisation des données</h2>
              <p className="leading-relaxed">
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Gérer votre compte et vos transactions</li>
                <li>Vous fournir nos services de jeux</li>
                <li>Vous envoyer des notifications importantes</li>
                <li>Améliorer et personnaliser votre expérience</li>
                <li>Prévenir la fraude et assurer la sécurité</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">3. Protection des données</h2>
              <p className="leading-relaxed">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour 
                protéger vos données personnelles contre tout accès non autorisé, modification, 
                divulgation ou destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">4. Partage des données</h2>
              <p className="leading-relaxed">
                Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations avec :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Nos prestataires de services de paiement</li>
                <li>Les autorités compétentes si requis par la loi</li>
                <li>Nos partenaires techniques pour le fonctionnement du service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">5. Conservation des données</h2>
              <p className="leading-relaxed">
                Vos données sont conservées aussi longtemps que votre compte est actif ou selon les 
                obligations légales en vigueur. Vous pouvez demander la suppression de vos données 
                en contactant notre support.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">6. Vos droits</h2>
              <p className="leading-relaxed">
                Vous disposez des droits suivants concernant vos données personnelles :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification des informations inexactes</li>
                <li>Droit à l'effacement de vos données</li>
                <li>Droit à la portabilité de vos données</li>
                <li>Droit d'opposition au traitement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">7. Cookies</h2>
              <p className="leading-relaxed">
                Nous utilisons des cookies essentiels pour le fonctionnement de l'application, 
                notamment pour maintenir votre session de connexion et mémoriser vos préférences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">8. Contact</h2>
              <p className="leading-relaxed">
                Pour toute question concernant cette politique de confidentialité ou pour exercer 
                vos droits, contactez-nous via les canaux de support disponibles dans l'application.
              </p>
            </section>
          </div>

          <p className="text-white/60 text-sm mt-8 pt-6 border-t border-white/20">
            Dernière mise à jour : Décembre 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
