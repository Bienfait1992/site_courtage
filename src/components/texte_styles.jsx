import React from "react";
import clsx from "clsx";

// Fonction pour gérer la taille responsive avec Tailwind
const responsiveClass = (base, md, lg) => `text-${base} md:text-${md} lg:text-${lg}`;

// Titres H1-H3
export const H1 = ({ children, className }) => (
  <h1
    className={clsx(
      responsiveClass("2xl", "4xl", "5xl"),
      "font-montserrat font-bold text-black",
      className
    )}
  >
    {children}
  </h1>
);

export const H2 = ({ children, className }) => (
  <h2
    className={clsx(
      responsiveClass("xl", "2xl", "3xl"),
      "font-montserrat font-bold text-blue-600",
      className
    )}
  >
    {children}
  </h2>
);

export const H3 = ({ children, className }) => (
  <h3
    className={clsx(
      responsiveClass("lg", "xl", "2xl"),
      "font-poppins font-semibold text-gray-800",
      className
    )}
  >
    {children}
  </h3>
);

// Paragraphes
export const Paragraph = ({ children, className }) => (
  <p
    className={clsx(
      "text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed text-justify",
      "font-poppins",
      className
    )}
  >
    {children}
  </p>
);

export const SmallParagraph = ({ children, className }) => (
  <p
    className={clsx(
      "text-xs sm:text-sm text-gray-500 leading-relaxed",
      "font-poppins",
      className
    )}
  >
    {children}
  </p>
);

// Texte des boutons
export const ButtonText = ({ children, className }) => (
  <span
    className={clsx(
      "text-sm md:text-base lg:text-lg font-bold text-white",
      "font-poppins",
      className
    )}
  >
    {children}
  </span>
);

// Labels
export const LabelText = ({ children, className }) => (
  <label
    className={clsx(
      "text-sm md:text-base text-gray-800 font-medium",
      "font-poppins",
      className
    )}
  >
    {children}
  </label>
);

// Notes ou petits textes
export const NoteText = ({ children, className }) => (
  <p
    className={clsx(
      "text-xs text-gray-400 italic",
      "font-poppins",
      className
    )}
  >
    {children}
  </p>
);

export const SM = ({ children, className }) => (
  <p
    className={clsx(
      "text-sm md:text-base text-gray-600 leading-relaxed",
      "font-poppins",
      className
    )}
  >
    {children}
  </p>
);

