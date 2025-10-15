import React, { useEffect, useState } from "react";
import { Sidebar } from "../sidebar";
import { useAuthStore } from "../../provider/useAuthStore";
import { CACard } from "./graphiques/CACard";
import { TopProductsCard } from "./graphiques/TopProductsCard";
import { ClientStatsCard } from "./graphiques/ClientStatsCard";
import { useDashboardStore } from "./store_dashboard";
// import classNames from "classnames";
import { HeaderDashboard } from "./header_dashboard";
import { RemunerationsKPI } from "./remunerations_table";
import { AuditLogs } from "./Audit/auditLogs ";
import { StockKPI } from "./stock/stock";
import { ClientsKPI } from "./Clients/clents";
import { InvoicesTable } from "./Invoices/Invoices";
import { OrdersTable } from "./order/orders";



export const HomeDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const authStore = useAuthStore();
  const user = authStore.user;


 const {
    stores,
    products,
    promotions,
    coupons,
    stats,
    latestSales,
    notifications,
     latestOrders,
    deliveries,
    caData,
    topProductsData,
    clientSegmentsData,
    fetchDashboardData,
  } = useDashboardStore();


//   const { stats, fetchDashboardStats } = useDashboardStore();
 // Maintenant tu peux utiliser stores, products, promotions, coupons
  useEffect(() => {
    fetchDashboardData(authStore.token);
  }, [authStore.token]);
 const kpiCards = [
    { title: "Ventes totales", value: stats.totalSales, color: "blue" },
    { title: "Ventes du jour", value: stats.todaySales, color: "green" },
    { title: "Ventes du mois", value: stats.monthSales, color: "teal" },
    { title: "Clients", value: stats.totalClients, color: "yellow" },
    { title: "Stock faible", value: stats.lowStock, color: "red" },
    { title: "Commandes en attente", value: stats.pendingOrders, color: "purple" },
    { title: "Livraisons en cours", value: stats.inTransitDeliveries, color: "orange" },
    { title: "Chiffre d’affaires", value: stats.totalRevenue + " $", color: "pink" },
  ];

const colorMap = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  teal: "bg-teal-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
};

  // Récupération des données depuis l'API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // KPIs
        const resStats = await fetch("http://localhost:3000/api/v1/dashboard/stats", {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        const statsData = await resStats.json();
        setStats(statsData);

        // Dernières ventes
        const resSales = await fetch("http://localhost:3000/api/v1/sales/latest", {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        const salesData = await resSales.json();
        setLatestSales(salesData);

        // Notifications
        const resNotif = await fetch("http://localhost:3000/api/v1/notifications", {
          headers: { Authorization: `Bearer ${authStore.token}` },
        });
        const notifData = await resNotif.json();
        setNotifications(notifData);
      } catch (err) {
        console.error("Erreur dashboard:", err);
        // toast.error("Impossible de charger le dashboard");
      }
    };

    fetchDashboardData();
  }, [authStore.token]);

  return (
    <div className="flex h-screen">
      {/* Sidebar
      <div
        className={`bg-gray-800 text-white transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
 
      </div> */}

      {/* Contenu principal */}
      <div className="flex-1  overflow-y-auto">
        




{/* Infos utilisateur connecté */}
{/* <div className="flex items-center justify-between mb-6 p-4 bg-gray-100 rounded shadow"> */}
  <div className="p-4 ">
    <h1 className="text-2xl font-bold">
      Bienvenue, {user?.name || user?.code || "Utilisateur"} ({user?.role})
    </h1>
    {user?.lastLogin && (
      <p className="text-sm text-gray-600">
        Dernière connexion : {new Date(user.lastLogin).toLocaleString()}
      </p>
    )}
    {user?.stores?.length > 0 && (
      <p className="text-sm text-gray-600">
        Boutiques assignées : {user.stores.map(s => s.name).join(", ")}
      </p>
    )}
  </div>

  {/* Avatar */}
  {/* {user?.avatarUrl && (
    <img
      src={user.avatarUrl}
      alt="Avatar utilisateur"
      className="w-16 h-16 rounded-full object-cover"
    />
  )} */}
{/* </div> */}





        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-8 p-6">
          <div className="bg-blue-500 text-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Ventes totales</h2>
            <p className="text-2xl">{stats.totalSales}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Ventes aujourd'hui</h2>
            <p className="text-2xl">{stats.todaysSales}</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Clients</h2>
            <p className="text-2xl">{stats.totalClients}</p>
          </div>
          <div className="bg-red-500 text-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Stock faible</h2>
            <p className="text-2xl">{stats.lowStock}</p>
          </div>
        </div>


        {/* Actions rapides */}
{/* <div className="mb-6 p-6"> */}
  {/* <h2 className="text-xl font-semibold mb-2">Actions rapides</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"> */}
    {/* Créer une vente / facture */}
    {/* <button
      onClick={() => console.log("Ouvrir formulaire de vente")}
      className="bg-blue-500 text-white p-4 rounded shadow hover:bg-blue-600 transition"
    >
      Créer une vente / facture
    </button> */}

    {/* Ajouter un client */}
    {/* <button
      onClick={() => console.log("Ouvrir formulaire client")}
      className="bg-green-500 text-white p-4 rounded shadow hover:bg-green-600 transition"
    >
      Ajouter un client
    </button> */}

    {/* Ajouter un produit */}
    {/* <button
      onClick={() => console.log("Ouvrir formulaire produit")}
      className="bg-yellow-500 text-white p-4 rounded shadow hover:bg-yellow-600 transition"
    >
      Ajouter un produit
    </button> */}

    {/* Synchroniser stock / données */}
    {/* <button
      onClick={() => console.log("Synchroniser stock / données")}
      className="bg-purple-500 text-white p-4 rounded shadow hover:bg-purple-600 transition"
    >
      Synchroniser données
    </button> */}

    {/* Générer rapports PDF / Excel */}
    {/* <button
      onClick={() => console.log("Générer rapports")}
      className="bg-red-500 text-white p-4 rounded shadow hover:bg-red-600 transition"
    >
      Générer rapports
    </button>
  </div> */}
{/* </div> */}
<div className="border-t border-gray-300 my-4 "></div>

        {/* Dernières ventes */}
        <div className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-2">Dernières ventes</h2>
          <table className="min-w-full bg-white shadow rounded">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Produit</th>
                <th className="px-4 py-2 border-b">Quantité</th>
                <th className="px-4 py-2 border-b">Client</th>
                <th className="px-4 py-2 border-b">Montant</th>
              </tr>
            </thead>
            <tbody>
              {latestSales.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-2">
                    Aucune vente récente
                  </td>
                </tr>
              )}
              {latestSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-4 py-2 border-b">{sale.productName}</td>
                  <td className="px-4 py-2 border-b">{sale.quantity}</td>
                  <td className="px-4 py-2 border-b">{sale.clientName || "—"}</td>
                  <td className="px-4 py-2 border-b">{sale.total} $</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

{/* //Les graphiques */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
  <CACard data={caData} />
  <TopProductsCard data={topProductsData} />
  <ClientStatsCard data={clientSegmentsData} />
</div>

<div className="border-t border-gray-300 my-4"></div>

<div className="mb-6 p-6">
  <h2 className="text-xl font-semibold mb-2">Gestion des magasins & produits</h2>
<div className="flex space-x-1 justify-between">
  {/* Boutiques */}
  <div className="mb-4">
    <h3 className="font-semibold">Boutiques gérées</h3>
    <ul>
      {stores.length === 0 && <li>Aucune boutique</li>}
      {stores.map((store) => (
        <li key={store.id}>
          {store.name} ({store.location})
        </li>
      ))}
    </ul>
  </div>

  {/* Produits */}
  <div className="mb-4 ">
    <h3 className="font-semibold">Produits en stock</h3>
    <table className="min-w-full bg-white shadow rounded">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Quantité</th>
          <th>Prix</th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 && <tr><td colSpan="3">Aucun produit</td></tr>}
        {products.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.quantity}</td>
            <td>{p.price} $</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Promotions & Coupons */}
  <div>
    <h3 className="font-semibold">Promotions actives</h3>
    <ul>
      {promotions.length === 0 && <li>Aucune promotion</li>}
      {promotions.map((promo) => (
        <li key={promo.id}>{promo.name} - expire le {promo.endDate}</li>
      ))}
    </ul>

    <h3 className="font-semibold mt-2">Coupons expirant bientôt</h3>
    <ul>
      {coupons.length === 0 && <li>Aucun coupon</li>}
      {coupons.map((c) => (
        <li key={c.id}>{c.code} - expire le {c.expirationDate}</li>
      ))}
    </ul>
  </div>
</div>

<div className="border-t border-gray-300 my-4"></div>

    <div className="space-y-6 flex justify-between">
      
      {/* Dernières ventes */}
      <div>
        <h2 className="text-xl font-semibold">Dernières ventes</h2>
        {latestSales.length === 0 ? (
          <p>Aucune vente récente</p>
        ) : (
          <ul>
            {latestSales.map((sale) => (
              <li key={sale.id}>
                {sale.productName} - {sale.quantity} - {sale.clientName || "—"} - {sale.total} $
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Commandes récentes */}
      <div>
        <h2 className="text-xl font-semibold">Commandes récentes</h2>
        <ul>
          {latestOrders.map((order) => (
            <li key={order.id}>
              {order.productName} - Statut: {order.status}
            </li>
          ))}
        </ul>
      </div>

      {/* Livraisons à suivre */}
      <div>
        <h2 className="text-xl font-semibold">Livraisons à suivre</h2>
        <ul>
          {deliveries.map((delivery) => (
            <li key={delivery.id}>
              {delivery.productName} - Statut: {delivery.status}
            </li>
          ))}
        </ul>
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-xl font-semibold">Notifications</h2>
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id}>{notif.message}</li>
          ))}
        </ul>
      </div>
    </div>
</div>

<div className="border-t border-gray-300 my-4"></div>

{/* Remuneration */}
<RemunerationsKPI className=""/>
<div className="border-t border-gray-300 my-4"></div>

{/* Statistiques générales (KPIs) */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  {kpiCards.map((kpi) => (
    <div
      key={kpi.title}
      className={`${colorMap[kpi.color]} text-white p-4 rounded shadow`}
    >
      <h2 className="text-lg font-semibold">{kpi.title}</h2>
      <p className="text-2xl">{kpi.value}</p>
    </div>
  ))}
</div>

    <div className="border-t border-gray-300 my-4"></div>
    <AuditLogs/>
     <div className="border-t border-gray-300 my-4"></div>


     {/* STOCK */}
     <StockKPI/>
      <div className="border-t border-gray-300 my-4"></div>
      {/* CLIENT */}

      <ClientsKPI/>
        <div className="border-t border-gray-300 my-4"></div>
        {/* FACTURE */}
        <InvoicesTable/>
         <div className="border-t border-gray-300 my-4"></div>

         {/* COMMANDE EN LIGNE */}
         <OrdersTable/>
           <div className="border-t border-gray-300 my-4"></div>
        {/* Notifications */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Notifications</h2>
          {notifications.length === 0 ? (
            <p className="text-gray-500">Aucune notification</p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="bg-gray-100 p-2 rounded shadow flex justify-between items-center"
                >
                  <span>{n.title}: {n.message}</span>
                  <span className="text-sm text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
