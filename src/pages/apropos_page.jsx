import React from "react";

export const AproposPage = () => {
  return (
    <div className="container mx-auto px-4  py-12 text-justify md:px-48">
      {/* Titre */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
        À propos de <span className="text-blue-600">BOURSE.CD</span>
      </h1>

      {/* Présentation */}
      <div className="space-y-6  text-lg leading-relaxed">
        <p>
          <strong>BOURSE.CD</strong> est une plateforme numérique moderne dédiée à
          l’actualité économique, aux entreprises et aux opportunités du marché
          congolais. 
          Nous mettons en avant les échos des entreprises, les
          innovations locales, et les informations essentielles pour les
          investisseurs, entrepreneurs et citoyens.
        </p>

        <p>
          Grâce à une interface simple et intuitive, le site vous permet de
          consulter les dernières actualités, découvrir des entreprises locales
          et accéder à des contenus pertinents pour comprendre l’évolution
          économique de la RDC.
        </p>
      </div>

      {/* Mission et Vision */}
      <div className="mt-12   gap-8">
        <div className=" bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Notre Mission</h2>
          <p className="text-gray-700">
            Offrir une information économique claire, fiable et accessible à
            tous, afin de promouvoir la transparence, l’éducation financière et
            le développement du marché congolais.
          </p>
        </div>
        <div className="mt-5  bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Notre Vision</h2>
          <p className="text-gray-700">
            Devenir la référence incontournable pour l’information économique en
            RDC et accompagner la transformation digitale des entreprises grâce
            à une plateforme innovante et ouverte.
          </p>
        </div>
      </div>

      {/* Propriétaire */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-2">Propriétaire</h2>
        <p className="text-gray-800 font-medium ">
          <span className="text-blue-600">Evariste SHAKO</span>
        </p>
        <p className="text-gray-600 mt-2">
          Entrepreneur et visionnaire, il est le fondateur de BOURSE.CD et
          s’engage à promouvoir une information économique accessible et de
          qualité au service du développement en RDC.
        </p>
      </div>

      {/* Contact rapide */}
      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold mb-4">Nous contacter</h2>
        <p className="text-gray-700">
          Pour toute information ou collaboration, veuillez nous écrire à :{" "}
          <a
            href="mailto:contact@bourse.cd"
            className="text-blue-600 font-medium hover:underline"
          >
            contact@bourse.cd
          </a>
        </p>
      </div>
    </div>
  );
};
