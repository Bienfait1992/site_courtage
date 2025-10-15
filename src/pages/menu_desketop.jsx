// src/components/DesktopMenu.jsx
import React from "react";
import { FaTimes } from "react-icons/fa";

export const DesktopMenu = ({ menu, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 md:flex bg-transparent text-blue-800 z-50">

      <ul className="bg-white shadow-2xl w-72 p-4 space-y-4 flex flex-col relative">
        {/* Bouton fermer */}
        <div className="flex justify-end mb-4">
          <button
            className="text-2xl text-gray-600 hover:text-black hover:border-b-blue-800 cursor-pointer"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        {/* Items du menu */}
        {menu.map((item) => (
          <li
            key={item.label}
            className="flex items-center gap-3 cursor-pointer hover:bg-blue-800 hover:text-amber-50 p-2 rounded transition-colors duration-300"
          >
            <span className="text-blue-600">{item.icon}</span>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
