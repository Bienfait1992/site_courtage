import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full text-white bg-blue-800 border-t border-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* A propos */}
          <div>
            <h2 className="text-lg font-semibold border-b border-white mb-4 pb-1">A PROPOS DE BOURSE.CD</h2>
            <ul className="space-y-2 text-sm">
              <li className="cursor-pointer hover:text-gray-300">Plan du site</li>
              <li className="hover:text-gray-300">Qui sommes-nous ?</li>
              <li className="hover:text-gray-300">Nouveautés</li>
              <li className="hover:text-gray-300">Rejoindre Bourse.cd</li>
              <li className="hover:text-gray-300">Espace presse</li>
            </ul>
          </div>

          {/* Informations légales */}
          <div>
            <h2 className="text-lg font-semibold border-b border-white mb-4 pb-1">INFORMATIONS LEGALES</h2>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-gray-300">Conditions générales d’utilisation</li>
              <li className="hover:text-gray-300">Référencement et classement des annonces</li>
              <li className="hover:text-gray-300">Conditions générales de vente</li>
              <li className="hover:text-gray-300">Vie privée / cookies</li>
              <li className="hover:text-gray-300">Vos droits et obligations</li>
              <li className="hover:text-gray-300">Avis utilisateurs</li>
              <li className="hover:text-gray-300">Charte de bonne conduite</li>
              <li className="hover:text-gray-300">Paiement en plusieurs fois</li>
              <li className="hover:text-gray-300">Accessibilité : partiellement conforme</li>
            </ul>
          </div>

          {/* Solutions pro */}
          <div>
            <h2 className="text-lg font-semibold border-b border-white mb-4 pb-1">SOLUTIONS PROFESSIONNELLES</h2>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-gray-300">Publicité</li>
              <li className="hover:text-gray-300">Professionnels de l’immobilier</li>
              <li className="hover:text-gray-300">Vos recrutements</li>
              <li className="hover:text-gray-300">Professionnels de l’auto</li>
              <li className="hover:text-gray-300">Professionnels du tourisme</li>
              <li className="hover:text-gray-300">Autres solutions professionnelles</li>
              <li className="hover:text-gray-300">Annuaire des professionnels</li>
              <li className="hover:text-gray-300">Dépôt d‘offres d‘emploi : tarif réservé aux TPE</li>
            </ul>
          </div>

          {/* Contact / aide */}
          <div>
            <h2 className="text-lg font-semibold border-b border-white mb-4 pb-1">DES QUESTIONS ?</h2>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-gray-300">Aide</li>
              <li className="hover:text-gray-300">Le paiement sécurisé et la livraison</li>
              <li className="hover:text-gray-300">Le porte-monnaie</li>
              <li className="hover:text-gray-300">Le service de réservation de vacances en ligne pour les hôtes</li>
              <li className="hover:text-gray-300">Votre dossier de location en ligne</li>
              <li className="hover:text-gray-300">Votre espace bailleur</li>
              <li className="hover:text-gray-300">Statut de nos services</li>
              <li className="hover:text-gray-300">Sécurité</li>
            </ul>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="mt-8 border-t border-white pt-4 flex flex-col md:flex-row items-center justify-between text-sm space-y-2 md:space-y-0">
          <span>&copy; {new Date().getFullYear()} Bource.cd. Tous droits réservés.</span>
          <div className="flex flex-wrap gap-4">
            <a href="/apropos" className="hover:text-gray-300">À propos</a>
            <a href="#" className="hover:text-gray-300">Contact</a>
            <a href="#" className="hover:text-gray-300">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
