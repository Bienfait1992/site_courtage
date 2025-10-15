import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../provider/useAuthStore";
import { FaUserAlt, FaLock } from "react-icons/fa";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const authStore = useAuthStore();
  const navigate = useNavigate();
  const isAuthenticated = authStore.isAuthenticated();
  const user = authStore.user;

  // 🔹 Redirection selon les rôles
  useEffect(() => {
    if (isAuthenticated && user?.roles) {
      const roles = user.roles.map(r => r.name);
      if (roles.includes("ADMIN")) {
        navigate("/dashboard_admin", { replace: true });
      } else {
        navigate("/features_news", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Adresse mail et mot de passe requis");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Réponse API login:", data);

      if (!response.ok) {
        setError(data.message || "Erreur lors de la connexion");
      } else {
        authStore.login(data.token, data.user);
        console.log("Utilisateur connecté :", data.user);

        const roles = data.user.roles.map(r => r.name);
        if (roles.includes("ADMIN")) {
          navigate("/dashboard_admin", { replace: true });
        } else {
          navigate("listeannonces", { replace: true });
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Connexion
        </h2>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="relative">
            <FaUserAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse mail"
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-4 text-gray-500 text-sm justify-between flex">
          <NavLink to="/forgot-password" className="hover:text-blue-600">
            Mot de passe oublié ?
          </NavLink>
          <NavLink to="/signup" className="hover:text-blue-600">
            S'inscrire
          </NavLink>
        </div>
      </div>
    </div>
  );
};
