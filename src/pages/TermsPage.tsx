import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
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
          <h1 className="text-3xl font-bold text-white mb-6">Conditions d'utilisation</h1>
          
          <div className="space-y-6 text-white/90">
            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">1. Acceptation des conditions</h2>
              <p className="leading-relaxed">
                En accédant et en utilisant l'application PAYWIN, vous acceptez d'être lié par ces conditions d'utilisation. 
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">2. Description du service</h2>
              <p className="leading-relaxed">
                PAYWIN est une plateforme de divertissement proposant des jeux interactifs. 
                L'utilisation de ce service est réservée aux personnes majeures selon la législation en vigueur dans leur pays de résidence.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">3. Inscription et compte</h2>
              <p className="leading-relaxed">
                Pour utiliser nos services, vous devez créer un compte avec des informations exactes et à jour. 
                Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les activités 
                effectuées sous votre compte.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">4. Utilisation responsable</h2>
              <p className="leading-relaxed">
                Vous vous engagez à utiliser PAYWIN de manière responsable et à ne pas exploiter de failles 
                ou bugs du système. Toute tentative de fraude ou de manipulation sera sanctionnée par la 
                suspension immédiate du compte.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">5. Solde et transactions</h2>
              <p className="leading-relaxed">
                Les transactions effectuées sur la plateforme sont définitives. Les retraits sont soumis à 
                vérification et peuvent nécessiter un délai de traitement. Nous nous réservons le droit de 
                demander des documents d'identité pour valider les transactions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">6. Limitation de responsabilité</h2>
              <p className="leading-relaxed">
                PAYWIN ne peut être tenu responsable des pertes financières résultant de l'utilisation de 
                la plateforme. Les jeux sont fournis à titre de divertissement et comportent des risques inhérents.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">7. Modifications des conditions</h2>
              <p className="leading-relaxed">
                Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront 
                informés des changements significatifs par notification dans l'application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-yellow-300 mb-3">8. Contact</h2>
              <p className="leading-relaxed">
                Pour toute question concernant ces conditions d'utilisation, veuillez nous contacter via 
                les canaux de support disponibles dans l'application.
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

export default TermsPage;
