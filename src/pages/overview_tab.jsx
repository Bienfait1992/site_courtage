// import { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
//   CartesianGrid,
// } from "recharts";

// export default function OverviewTab({ token }) {
//   const [users, setUsers] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ----------------- Fetch Users -----------------
//   const fetchUsers = async () => {
//     try {
//       const res = await fetch("http://localhost:3000/api/v1/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Erreur récupération utilisateurs");
//       const data = await res.json();
//       setUsers(data);
//     } catch (err) {
//       console.error(err);
//       setUsers([]);
//     }
//   };

//   // ----------------- Fetch Categories -----------------
//   const fetchCategories = async () => {
//     try {
//       const res = await fetch("http://localhost:3000/api/v1/categories", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Erreur récupération catégories");
//       const data = await res.json();
//       setCategories(data);
//     } catch (err) {
//       console.error(err);
//       setCategories([]);
//     }
//   };

//   // ----------------- Fetch News -----------------
//   const fetchNews = async () => {
//     try {
//       const res = await fetch("http://localhost:3000/api/v1/news", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Erreur récupération news");
//       const data = await res.json();
//       setNews(data);
//     } catch (err) {
//       console.error(err);
//       setNews([]);
//     }
//   };

//   useEffect(() => {
//     const fetchAll = async () => {
//       setLoading(true);
//       await Promise.all([fetchUsers(), fetchCategories(), fetchNews()]);
//       setLoading(false);
//     };
//     fetchAll();
//   }, [token]);

//   if (loading) return <p>Chargement de la vue d’ensemble...</p>;

//   // ----------------- Calcul KPI -----------------
//   const activeUsers = users.filter((u) => u.isActive).length;
//   const inactiveUsers = users.filter((u) => !u.isActive).length;

//   // ----------------- Données graphiques -----------------
//   const userChartData = [
//     { name: "Actifs", count: activeUsers },
//     { name: "Désactivés", count: inactiveUsers },
//   ];

//   const categoriesChartData = categories.map((cat) => ({
//     name: cat.name,
//     count: cat.ads?.length || 0,
//   }));

//   const newsChartData = [
//     { name: "Total news", count: news.length },
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Titre + sous-titre */}
//       <div>
//         <h2 className="text-2xl font-semibold mb-2">Vue d’ensemble</h2>
//         <p className="text-gray-600 mb-4">
//           Résumé rapide des utilisateurs, annonces et news.
//         </p>
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
//           <span className="text-gray-500">Utilisateurs actifs</span>
//           <span className="text-2xl font-bold">{activeUsers}</span>
//         </div>
//         <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
//           <span className="text-gray-500">Utilisateurs désactivés</span>
//           <span className="text-2xl font-bold">{inactiveUsers}</span>
//         </div>
//         <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
//           <span className="text-gray-500">Annonces publiées</span>
//           <span className="text-2xl font-bold">{categories.reduce((sum, c) => sum + (c.ads?.length || 0), 0)}</span>
//         </div>
//         <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
//           <span className="text-gray-500">News créées</span>
//           <span className="text-2xl font-bold">{news.length}</span>
//         </div>
//       </div>

//       {/* Actions rapides */}
//       <div className="flex flex-col sm:flex-row gap-2">
//         <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//           Ajouter un utilisateur
//         </button>
//         <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
//           Ajouter une annonce
//         </button>
//         <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
//           Publier une news
//         </button>
//       </div>

//       {/* Graphique utilisateurs */}
//       <div className="bg-white shadow rounded-lg p-4">
//         <h3 className="text-lg font-semibold mb-2">Tendances utilisateurs</h3>
//         <ResponsiveContainer width="100%" height={250}>
//           <BarChart data={userChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis allowDecimals={false} />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="count" fill="#3182CE" barSize={50} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Graphique annonces */}
//       <div className="bg-white shadow rounded-lg p-4">
//         <h3 className="text-lg font-semibold mb-2">Annonces par catégorie</h3>
//         <ResponsiveContainer width="100%" height={250}>
//           <BarChart data={categoriesChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis allowDecimals={false} />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="count" fill="#38A169" barSize={40} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Graphique news */}
//       <div className="bg-white shadow rounded-lg p-4">
//         <h3 className="text-lg font-semibold mb-2">Nombre de news</h3>
//         <ResponsiveContainer width="100%" height={200}>
//           <BarChart data={newsChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis allowDecimals={false} />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="count" fill="#805AD5" barSize={50} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

export default function OverviewTab({ token }) {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ads, setAds] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------- Fetch Users -----------------
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur récupération utilisateurs");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  // ----------------- Fetch Categories -----------------
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur récupération catégories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  };

  // ----------------- Fetch Ads -----------------
  const fetchAds = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/ads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur récupération annonces");
      const data = await res.json();
      setAds(data);
    } catch (err) {
      console.error(err);
      setAds([]);
    }
  };

  // ----------------- Fetch News -----------------
  const fetchNews = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/news", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur récupération news");
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error(err);
      setNews([]);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchCategories(), fetchAds(), fetchNews()]);
      setLoading(false);
    };
    fetchAll();
  }, [token]);

  if (loading) return <p>Chargement de la vue d’ensemble...</p>;

  // ----------------- Calcul KPI -----------------
  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = users.filter((u) => !u.isActive).length;

  // KPI annonces par catégorie
  const categoriesChartData = categories.map((cat) => ({
    name: cat.name,
    count: ads.filter((ad) => ad.categoryId === cat.id).length,
  }));

  // Graphiques données
  const userChartData = [
    { name: "Actifs", count: activeUsers },
    { name: "Désactivés", count: inactiveUsers },
  ];

  const newsChartData = [{ name: "Total news", count: news.length }];

  return (
    <div className="space-y-6">
      {/* Titre + sous-titre */}
      <div>
        <h2 className="text-2xl font-semibold mb-2">Vue d’ensemble</h2>
        <p className="text-gray-600 mb-4">
          Résumé rapide des utilisateurs, annonces et news.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-gray-500">Utilisateurs actifs</span>
          <span className="text-2xl font-bold">{activeUsers}</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-gray-500">Utilisateurs désactivés</span>
          <span className="text-2xl font-bold">{inactiveUsers}</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-gray-500">Annonces publiées</span>
          <span className="text-2xl font-bold">{ads.length}</span>
        </div>
        <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center">
          <span className="text-gray-500">News créées</span>
          <span className="text-2xl font-bold">{news.length}</span>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Ajouter un utilisateur
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Ajouter une annonce
        </button>
        <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          Publier une news
        </button>
      </div>

      {/* Graphique utilisateurs */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Tendances utilisateurs</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={userChartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3182CE" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique annonces */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Annonces par catégorie</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={categoriesChartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#38A169" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique news */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Nombre de news</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={newsChartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#805AD5" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
