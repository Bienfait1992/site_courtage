import React, { useState } from "react";
import { FaBars, FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  // ✅ Tableau de liens défini correctement
  const links = [
    { to: "/", icon: <FaHome />, label: "Accueil" },
    { to: "/profile", icon: <FaUser />, label: "Profil" },
    { to: "/settings", icon: <FaCog />, label: "Paramètres" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-blue-600 text-white min-h-screen transition-all duration-300 flex flex-col`}
      >
        {/* Toggle button */}
        <button
          className="p-4 text-xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars />
        </button>

        {/* Menu */}
        <nav className="flex-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 px-4 py-2 hover:bg-blue-500"
            >
              {link.icon}
              {isOpen && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Déconnexion */}
        <button className="flex items-center gap-3 px-4 py-2 hover:bg-red-500">
          <FaSignOutAlt />
          {isOpen && <span>Déconnexion</span>}
        </button>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6">Ici ton contenu principal</div>
    </div>
  );
};
