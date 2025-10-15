// import { create } from "zustand";
// import toast from "react-hot-toast";

// export const useAuthStore = create((set, get) => ({
//   // État initial
//   token: localStorage.getItem("token") || null,
//   user: (() => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       return storedUser && storedUser !== "undefined"
//         ? JSON.parse(storedUser)
//         : null;
//     } catch (e) {
//       console.error("Erreur parsing user:", e);
//       return null;
//     }
//   })(),

//   // Connexion
//   login: (token, user) => {
//     // Ici, user = { id, name, email, phone, role, avatar? }
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//     set({ token, user });
//     toast.success(`Bienvenue, ${user?.name || "Utilisateur"} !`);
//   },

//   // Déconnexion
//   logout: () => {
//     const user = get().user;
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     set({ token: null, user: null });
//     toast.success(
//       user ? `${user.name} est déconnecté(e) !` : "Vous êtes déconnecté !"
//     );
//   },

//   // Vérifie si l'utilisateur est connecté
//   isAuthenticated: () => !!get().token,

//   // Vérifie si l'utilisateur a un rôle spécifique (utile pour admin)
//   hasRole: (roleName) => {
//     const user = get().user;
//     return user?.role === roleName;
//   },

//   // Mettre à jour l'utilisateur (utile si infos changent)
//   setUser: (user) => {
//     localStorage.setItem("user", JSON.stringify(user));
//     set({ user });
//   },

//   // Mettre à jour uniquement l'avatar
//   setAvatar: (avatarUrl) => {
//     const user = get().user;
//     if (!user) return;
//     const updatedUser = { ...user, avatar: avatarUrl };
//     localStorage.setItem("user", JSON.stringify(updatedUser));
//     set({ user: updatedUser });
//     toast.success("Photo de profile mis à jour !");
//   },

//   // Vérifie si l'utilisateur peut déposer une annonce
//   canPostAnnonce: () => !!get().token, // ici c’est juste connecté = peut poster
// }));




import { create } from "zustand";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  // État initial
  token: localStorage.getItem("token") || null,
  user: (() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
    } catch (e) {
      console.error("Erreur parsing user:", e);
      return null;
    }
  })(),

  // Connexion
  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user });
    toast.success(`Bienvenue, ${user?.name || "Utilisateur"} !`);
  },

  // Déconnexion
  logout: () => {
    const user = get().user;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
    toast.success(
      user ? `${user.name} est déconnecté(e) !` : "Vous êtes déconnecté !"
    );
  },

  // Vérifie si l'utilisateur est connecté
  isAuthenticated: () => !!get().token,

  // Vérifie si l'utilisateur a un rôle spécifique
  hasRole: (roleName) => {
    const user = get().user;
    return user?.role === roleName;
  },

  // Mettre à jour l'utilisateur
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  // Mettre à jour uniquement l'avatar
  setAvatar: (avatarUrl) => {
    const user = get().user;
    if (!user) return;
    const updatedUser = { ...user, avatar: avatarUrl };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    set({ user: updatedUser });
    toast.success("Photo de profil mis à jour !");
  },

  // Vérifie si l'utilisateur peut déposer une annonce
  canPostAnnonce: () => !!get().token,

  // --- NOUVEAU : Récupération de l'utilisateur depuis le backend ---
  fetchCurrentUser: async () => {
    try {
      const { token } = get();
      if (!token) return;

      const response = await fetch("http://localhost:3000/api/v1/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token invalide → reset
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          set({ token: null, user: null });
        }
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      set({ user: data });
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error("Erreur fetchCurrentUser:", err.message);
    }
  },
}));

// --- AUTO FETCH AU LANCEMENT ---
const store = useAuthStore.getState();
if (store.token && !store.user) {
  store.fetchCurrentUser();
}


