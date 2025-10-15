// src/components/ButtonStyles.js
import React from "react";
import clsx from "clsx"; // pour gérer facilement les classes conditionnelles

// Bouton Gradient
export const GradientButton = ({ children, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-full md:w-1/2 py-3 md:py-4 rounded-[19px] font-bold text-white text-lg md:text-xl transition-all duration-200",
        "bg-gradient-to-r from-[#00BAFF] to-[#5CE1E6]",
        "hover:opacity-90",
        disabled && "from-gray-400 to-gray-300 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
};

// Bouton Solid
export const SolidButton = ({ children, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-full md:w-1/2 py-3 md:py-4 rounded-[19px] font-bold text-white text-lg md:text-xl transition-all duration-200",
        "bg-blue-600 hover:bg-blue-700",
        disabled && "bg-gray-400 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
};

// Bouton Outline
export const OutlineButton = ({ children, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "w-full md:w-1/2 py-3 md:py-4 rounded-[19px] font-bold text-blue-600 text-lg md:text-xl border-2 border-blue-600 transition-all duration-200",
        "hover:bg-blue-50",
        disabled && "text-gray-400 border-gray-400 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
};

// Bouton avec état Loading
export const LoadingButton = ({ children, loading, onClick, type = "gradient" }) => {
  const BaseButton = type === "solid" ? SolidButton : type === "outline" ? OutlineButton : GradientButton;

  return (
    <BaseButton onClick={onClick} disabled={loading}>
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
          Chargement...
        </div>
      ) : (
        children
      )}
    </BaseButton>
  );
};
