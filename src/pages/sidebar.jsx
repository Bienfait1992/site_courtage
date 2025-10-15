import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

export const Sidebar = ({ menuItems, isOpen, onClose }) => {
  const [showMegaMenuMobile, setShowMegaMenuMobile] = useState(false);
  const [showServicesMobile, setShowServicesMobile] = useState(false);

  const actualitesSubMenu = [
    "Spécial Elections","Politique","Economie","Provinces","Femme","Santé","Automobile",
    "Culture","Science & env.","Aviation","Musique","Société","Insolite","Habitation",
    "Sport","Diaspora","Afrique","Religion"
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50 overflow-y-auto`}
      >
        <ul className="flex flex-col mt-20 space-y-4 p-5 text-black">
          {menuItems.map((item) => (
            <li key={item.label} className="flex flex-col">
              <button
  className="flex justify-between items-center w-full px-3 py-2 rounded hover:bg-blue-600 hover:text-white transition-colors duration-300"
  onClick={() => {
    if (item.label === "ACTUALITES") {
      setShowMegaMenuMobile(!showMegaMenuMobile);
    } else if (item.label === "SERVICES") {
      setShowServicesMobile(!showServicesMobile);
    } else {
      onClose();
    }
  }}
>
  {item.label}
  {(item.label === "ACTUALITES" || item.label === "SERVICES") && <FaChevronRight />}
</button>


              {/* Sous-menu ACTUALITES */}
              {item.label === "ACTUALITES" && showMegaMenuMobile && (
                <ul className="pl-4 flex flex-col space-y-2 mt-2">
                  {actualitesSubMenu.map((subItem, index) => (
                    <li
                      key={index}
                      className="p-2 rounded hover:bg-blue-200 cursor-pointer"
                      onClick={onClose}
                    >
                      {subItem}
                    </li>
                  ))}
                </ul>
              )}
              {item.label === "SERVICES" && showServicesMobile && (
  <ul className="pl-4 flex flex-col space-y-2 mt-2">
    {["Voyage", "Logistique", "Transport"].map((subItem) => (
      <li
        key={subItem}
        className="p-2 rounded hover:bg-blue-200 cursor-pointer"
        onClick={onClose}
      >
        {subItem}
      </li>
    ))}
  </ul>
)}



            </li>
          ))}
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};
