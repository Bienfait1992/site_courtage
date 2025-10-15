import React from "react";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../provider/useAuthStore";

export const Sidebar = ({ isOpen }) => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-800 text-white">
      <h2
        className={`text-xl font-bold mb-6 transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        Menu
      </h2>
      <ul className="flex flex-col gap-4">
        <li>
          <Link
            to="/dashboard"   // ✅ redirection correcte vers HomeDashboard
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <FaHome />
            {isOpen && <span>Dashboard</span>}
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <FaUser />
            {isOpen && <span>Profil</span>}
          </Link>
        </li>
        <li
          className="flex items-center gap-2 hover:text-blue-400 cursor-pointer"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          {isOpen && <span>Déconnexion</span>}
        </li>
      </ul>
    </div>
  );
};
