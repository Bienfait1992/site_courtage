import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaSignInAlt, FaUserCircle, FaCog, FaSignOutAlt, FaBars, FaTimes, FaInfoCircle, FaBlog, FaShoppingCart, FaMoneyBillAlt, FaChevronRight } from "react-icons/fa";
import { useAuthStore } from "../provider/useAuthStore";
import { Sidebar } from "./sidebar";

export const SectionMenu = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showServicesDesktop,  setShowServicesDesktop] = useState(false);

  setShowServicesDesktop
  const [open, setOpen] = useState(false);
    const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated());
  const authStore = useAuthStore();

  const handleDeposerAnnonce = () => {
    if (!isLoggedIn) navigate("/login");
    else navigate("/annonce_form");
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => setOpen(false);

  const menuItems = [
    { label: "ACCUEIL", path: "listeannonces" },
    { label: "ANNONCES", path: "/listeannonces" },
     { label: "SERVICES" },
    { label: "PUBLIREPORTAGES", path: "/publireportages" },
    { label: "CONTACT", path: "/contact_page" },
  ];

 



  return (
    <div className="sticky top-0 z-50">
      {/* Header desktop & mobile */}
      <header className="bg-white shadow-md px-4 sm:px-6 lg:px-20 flex justify-between items-center h-16">
        {/* <img src="src/assets/images.png" alt="Logo" className="w-32 sm:w-40" /> */}
        <p className="text-blue-600 font-bold text-3xl">BOURSE.CD</p>

        {/* Right nav */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handleDeposerAnnonce}
            className="border-blue-800 border text-blue-800 text-sm sm:text-base px-3 sm:px-4 py-1.5 rounded-md hover:bg-blue-800  hover:text-white transition-colors cursor-pointer"
          >
            Déposer une annonce
          </button>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {/* <FaUser /> */}
               {user?.avatar ? (
    <img
      src={user.avatar}
      alt="Avatar"
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    <FaUser className="text-gray-500 w-6 h-6" />
  )}
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-52 bg-white border rounded-md shadow-lg z-50">
                <NavLink to="/login" onClick={handleLinkClick} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
                  <FaSignInAlt /> Se connecter
                </NavLink>
                <NavLink to="/profile" onClick={handleLinkClick} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
                  <FaUserCircle /> Profil
                </NavLink>
                <NavLink to="/settings" onClick={handleLinkClick} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
                  <FaCog /> Paramètres
                </NavLink>
                <button
                  onClick={() => {
                    authStore.logout();
                    handleLinkClick();
                    navigate("/features_news");
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  <FaSignOutAlt /> Se déconnecter
                </button>
              </div>
            )}
          </div>



        </nav>
      </header>

      {/* Navbar principale */}
      <div className="bg-blue-800 text-white flex justify-between items-center p-2 sm:px-6 relative md:px-48 md:py-4">
        {/* Hamburger mobile */}
        <button className="md:hidden text-2xl" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop menu */}
<ul className="hidden md:flex space-x-2 lg:space-x-5 relative w-full">
  {menuItems.map((item) => (
    <li
      key={item.label}
      className="relative group cursor-pointer px-2 py-1 rounded hover:bg-white hover:text-black transition"
      onMouseEnter={() => item.label === "SERVICES" && setShowServicesDesktop(true)}
      onMouseLeave={() => item.label === "SERVICES" && setShowServicesDesktop(false)}
    >
      <NavLink to={item.path}>{item.label}</NavLink>

      {item.label === "ACTUALITES" && (
        <div className="absolute left-[-304px] top-full w-screen bg-white text-black shadow-lg z-40 hidden group-hover:block">
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {actualitesSubMenu.map((subItem, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 cursor-pointer p-2 hover:bg-blue-100 rounded transition border-b-1 border-gray-300"
              >
                <FaChevronRight className="text-gray-500 text-xs group-hover:text-blue-600" />
                <span>{subItem}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    {item.label === "SERVICES" && showServicesDesktop && (
  <div className="absolute left-0 top-full bg-white text-black shadow-lg z-40 w-48">
    <ul className="flex flex-col p-2">
      {["Voyage", "Logistique", "Transport"].map((subItem) => (
        <li
          key={subItem}
          className="p-2 rounded hover:bg-blue-100 cursor-pointer"
          onClick={() => {
            if (subItem === "Voyage") navigate("/voyage");
            else if (subItem === "Logistique") navigate("/logistique");
            else if (subItem === "Transport") navigate("/transport");
          }}
        >
          {subItem}
        </li>
      ))}
    </ul>
  </div>
)}

    </li>
  ))}
</ul>
        {/* Menu extra mobile */}
        {menuOpen && (
          <div className="absolute top-full left-0 md:flex bg-transparent text-blue-800 z-50">
            <ul className="bg-white shadow-2xl w-72 p-4 space-y-3 flex flex-col relative">
              <div className="flex justify-end mb-2">
                <button onClick={() => setMenuOpen(false)} className="text-2xl text-gray-600 hover:text-black"><FaTimes /></button>
              </div>
              {menuExtra.map((item) => (
                <li key={item.label} className="flex items-center gap-3 cursor-pointer hover:bg-blue-800 hover:text-amber-50 p-2 rounded transition">
                  <span className="text-blue-600">{item.icon}</span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sidebar mobile */}
      <Sidebar menuItems={menuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};
