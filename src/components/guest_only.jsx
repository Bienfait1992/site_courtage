// GuestOnly.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../provider/useAuthStore";

export function GuestOnly({ redirectTo = "/features_news" }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const user = useAuthStore((s) => s.user);

  if (isAuthenticated) {
    // Redirection selon le rôle
    if (user?.role === "ADMIN") {
      return <Navigate to="/dashboard_admin" replace />;
    }
    return <Navigate to={redirectTo} replace />;
  }

  // Utilisateur non connecté → peut voir la page
  return <Outlet />;
}
