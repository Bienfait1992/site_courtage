import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AvatarUpdater from "../../../pages/avatar_updater";
import {
  FaUsers,
  FaClipboardList,
  FaChartPie,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaNewspaper,
  FaBriefcase,     // emploi
  FaBuilding,      // entreprise
  FaBullhorn,      // publicité
} from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useAuthStore } from "../../../provider/useAuthStore";
import OverviewTab from "../../../pages/overview_tab";
import { PubManager } from "../../../pages/pubs/pub_manager";

// ----------------- Users Tab -----------------
function UsersTab({ users, loading, toggleUserActive, deleteUser }) {
  if (loading) return <p>Chargement des utilisateurs...</p>;
  if (!users.length) return <p>Aucun utilisateur trouvé.</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">Gestion des utilisateurs</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Statut</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.isActive ? "Actif" : "Inactif"}</td>
              <td className="p-2 border space-x-2">
                <button
                  className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => toggleUserActive(u.id)}
                >
                  {u.isActive ? "Désactiver" : "Activer"}
                </button>
                <button
                  className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={() => deleteUser(u.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ----------------- Categories Tab -----------------
function CategoriesTab({ categories, loading, fetchCategories }) {
  if (loading) return <p>Chargement des catégories...</p>;
  if (!categories.length) return <p>Aucune catégorie trouvée.</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4">Gestion des catégories</h2>
      <button
        className="mb-4 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
        onClick={fetchCategories}
      >
        Rafraîchir
      </button>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Description</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">{c.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ----------------- Main Dashboard -----------------
export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [collapsedDesktopSidebar, setCollapsedDesktopSidebar] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useAuthStore((state) => state.navigate) || useNavigate();
  const token = useAuthStore((state) => state.token);
  const [avatar, setAvatar] = useState(user?.avatar || "https://i.pravatar.cc/150?img=3");

  // Dropdown avatar
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    setAvatar(user?.avatar || "https://i.pravatar.cc/150?img=3");
  }, [user?.avatar]);

  const displayUser = {
    name: user?.name || "Utilisateur",
    role: user?.role || "Super Admin",
    avatar: user?.avatar || "https://i.pravatar.cc/150?img=3",
  };

  // ----------------- Users -----------------
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch("http://localhost:3000/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Erreur récupération utilisateurs:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleUserActive = async (id) => {
    const user = users.find((u) => u.id === id);
    const action = user.isActive ? "désactiver" : "activer";
    if (!window.confirm(`Voulez-vous vraiment ${action} cet utilisateur ?`))
      return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/users/${id}/toggle-active`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Erreur serveur");
      setUsers(users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)));
    } catch (err) {
      console.error(err);
      alert("Impossible de modifier le statut : " + err.message);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/v1/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer l'utilisateur : " + err.message);
    }
  };

  // ----------------- Categories -----------------
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await fetch("http://localhost:3000/api/v1/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Erreur récupération catégories:", err);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  useEffect(() => {
    if (activeTab === "ads") fetchCategories();
  }, [activeTab]);

  // ----------------- Sidebar -----------------
  const menuItems = [
    { key: "overview", label: "Tableau de bord", icon: <FaChartPie /> },
    { key: "users", label: "Utilisateurs", icon: <FaUsers /> },
    { key: "ads", label: "Annonces", icon: <FaClipboardList /> },
    { key: "news", label: "News", icon: <FaNewspaper /> },
    { key: "jobs", label: "Offres d'emplois", icon: < FaBriefcase /> },
    { key: "echos", label: "Echos d'entreprises", icon: <FaBuilding /> },
    { key: "pubs", label: "Publicités", icon: <FaBullhorn /> },
    { key: "settings", label: "Paramètres", icon: <FaCog /> },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-blue-800">
        {!collapsedDesktopSidebar && !isMobile && (
          <span className="text-2xl font-bold">Admin</span>
        )}
        {isMobile && (
          <button className="sm:hidden" onClick={() => setShowMobileSidebar(false)}>
            ✕
          </button>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-3">
        {menuItems.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              if (isMobile) setShowMobileSidebar(false);
            }}
            className={`flex items-center ${
              collapsedDesktopSidebar && !isMobile ? "justify-center" : "gap-2"
            } w-full px-3 py-2 rounded-lg ${
              activeTab === tab.key ? "bg-blue-900" : "hover:bg-blue-800"
            }`}
          >
            {tab.icon}
            {(!collapsedDesktopSidebar || isMobile) && <span>{tab.label}</span>}
          </button>
        ))}
      </nav>
      <button
        onClick={() => {
          logout();
          navigate("/features_news");
        }}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 m-4 rounded-lg"
      >
        <FaSignOutAlt />
        <span>Déconnexion</span>
      </button>
    </>
  );

  // ----------------- JSX -----------------
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <div
        className={`hidden sm:flex sm:flex-col bg-blue-800 text-white transition-all duration-300 ${
          collapsedDesktopSidebar ? "w-20" : "w-64"
        }`}
      >
        <div className="flex justify-end p-2 border-b border-blue-600">
          <button
            className="p-2 rounded hover:bg-blue-600"
            onClick={() => setCollapsedDesktopSidebar(!collapsedDesktopSidebar)}
          >
            <FaBars />
          </button>
        </div>
        <SidebarContent />
      </div>

      {/* Sidebar Mobile */}
      {showMobileSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-blue-800 text-white flex flex-col shadow-lg">
            <SidebarContent isMobile={true} />
          </div>
          <div
            className="flex-1 bg-black opacity-50"
            onClick={() => setShowMobileSidebar(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <button
              className="sm:hidden p-2 rounded bg-gray-200"
              onClick={() => setShowMobileSidebar(true)}
            >
              <FaBars />
            </button>
            <div>
              <h1 className="text-xl font-semibold">{displayUser.name}</h1>
              <p className="text-sm text-gray-500">{displayUser.role}</p>
            </div>
          </div>

          {/* Avatar + Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="w-12 h-12 rounded-full border-2 border-blue-500 overflow-hidden flex items-center justify-center bg-gray-200 cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-gray-500 w-6 h-6" />
              )}
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-4 z-50">
                
                <div className=" items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full border overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-gray-500 w-6 h-6 mx-auto mt-3" />
                    )}
                  </div>
                  <AvatarUpdater userId={user.id} token={token} className="mt-[-100]"/>
                </div>


                <button
        onClick={() => {
          logout();
          navigate("/features_news");
        }}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 m-4 rounded-lg text-white"
      >
        <FaSignOutAlt />
        <span>Déconnexion</span>
      </button>
              </div>
            )}
          </div>
        </header>

        {/* Contenu principal */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "users" && (
            <UsersTab
              users={users}
              loading={loadingUsers}
              toggleUserActive={toggleUserActive}
              deleteUser={deleteUser}
            />
          )}
          {activeTab === "ads" && (
            <CategoriesTab
              categories={categories}
              loading={loadingCategories}
              fetchCategories={fetchCategories}
            />
          )}
          {activeTab === "news" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">News Management</h2>
              <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
                <CreateNews />
              </div>
            </div>
          )}
          {activeTab === "jobs" && <JobFormPage />}
          {activeTab === "echos" && <CreateEchoForm />}
          {activeTab === "pubs" && <PubManager />}
          {activeTab === "settings" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Paramètres</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
