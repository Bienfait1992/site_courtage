import { create } from "zustand";

export const useDashboardStore = create((set) => ({
  loading: false,

  // KPIs
  stats: {
    totalSales: 0,
    todaysSales: 0,
    totalClients: 0,
    lowStock: 0,
     pendingOrders: 0,
    inTransitDeliveries: 0,
    totalRevenue: 0,
  },
  latestSales: [],
  notifications: [],
  caData: [],
  topProductsData: [],
  clientSegmentsData: [],

  latestOrders: [],       // commandes récentes (status: PENDING, PAID, SHIPPED)
  deliveries: [],         // livraisons à suivre (status: IN_TRANSIT ou PENDING)


  // Gestion ADMIN / SELLER
  stores: [],
  products: [],
  promotions: [],
  coupons: [],

  // Fetch centralisé
  fetchDashboardData: async (token) => {
    set({ loading: true });
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [
        statsRes,
        salesRes,
        notifRes,
        caRes,
        topRes,
        clientsRes,
        storesRes,
        productsRes,
        promotionsRes,
        couponsRes,
        ordersRes,
        deliveriesRes
      ] = await Promise.all([
        fetch("/api/v1/dashboard/stats", { headers }).then(r => r.json()),
        fetch("/api/v1/sales/latest", { headers }).then(r => r.json()),
        fetch("/api/v1/notifications", { headers }).then(r => r.json()),
        fetch("/api/v1/dashboard/ca", { headers }).then(r => r.json()),
        fetch("/api/v1/dashboard/top-products", { headers }).then(r => r.json()),
        fetch("/api/v1/dashboard/client-stats", { headers }).then(r => r.json()),
        fetch("/api/v1/stores", { headers }).then(r => r.json()),
        fetch("/api/v1/products", { headers }).then(r => r.json()),
        fetch("/api/v1/promotions", { headers }).then(r => r.json()),
        fetch("/api/v1/coupons", { headers }).then(r => r.json()),
        fetch("/api/v1/orders/latest", { headers }).then(r => r.json()),
        fetch("/api/v1/deliveries/pending", { headers }).then(r => r.json()),
        fetch("/api/v1/dashboard/stats", { headers }).then(r => r.json()),
      ]);

      set({
        stats: statsRes,
        latestSales: salesRes,
        notifications: notifRes,
        caData: caRes,
        topProductsData: topRes,
        clientSegmentsData: clientsRes,
        stores: storesRes,
        products: productsRes,
        promotions: promotionsRes,
        coupons: couponsRes,
        latestOrders: ordersRes,
        deliveries: deliveriesRes,
      });
    } catch (err) {
      console.error("Erreur fetch dashboard:", err);
    } finally {
      set({ loading: false });
    }
  },

   fetchDashboardStats: async (token) => {
    set({ loading: true });
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const statsRes = await fetch("/api/v1/dashboard/stats", { headers }).then(r => r.json());

      set({ stats: statsRes });
    } catch (err) {
      console.error("Erreur fetch KPIs:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
