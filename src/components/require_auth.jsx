import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../provider/useAuthStore";

export function RequireAuth({ role }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const location = useLocation();

  if (!token || !isAuthenticated) {
    // Non connecté → redirection vers login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    // Rôle non autorisé → redirection selon rôle actuel
    if (user?.role === "ADMIN") {
      return <Navigate to="/dashboard_admin" replace />;
    } else {
      return <Navigate to="/features_news" replace />;
    }
  }

  // Conditions ok → rendre les enfants
  return <Outlet />;
}
