import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();


// const handleRegister = async (e) => {
//   e.preventDefault();
//   setError("");
//   setSuccess("");

//   if (!name || !email || !phone || !password) {
//     setError("Tous les champs sont requis");
//     return;
//   }

//   setLoading(true);

//   try {
//     const response = await fetch("http://localhost:3000/api/v1/users/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, phone, password }),
//     });

//     const data = await response.json();
//     console.log("Réponse API register:", data);

//     if (!response.ok) {
//       setError(data.message || "Erreur lors de l'inscription");
//     } else {
//       toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
//       setName("");
//       setEmail("");
//       setPhone("");
//       setPassword("");

//       // Redirection vers la page login
//       navigate("/login");
//     }
//   } catch (err) {
//     console.error("Erreur serveur:", err);
//     setError("Erreur serveur, veuillez réessayer");
//   } finally {
//     setLoading(false);
//   }
// };

const handleRegister = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (!name || !email || !phone || !password) {
    setError("Tous les champs sont requis");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("http://localhost:3000/api/v1/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    const data = await response.json();
    console.log("Réponse API register:", data);

    if (!response.ok) {
      setError(data.message || "Erreur lors de l'inscription");
    } else {
      toast.success("Inscription réussie ! Veuillez vérifier votre e-mail.");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");

      navigate("/login");
    }
  } catch (err) {
    console.error("Erreur serveur:", err);
    setError("Erreur serveur, veuillez réessayer");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Inscription
        </h2>

        <form className="space-y-5" onSubmit={handleRegister}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Votre nom"
            className="w-full pl-4 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse mail"
            className="w-full pl-4 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Téléphone"
            className="w-full pl-4 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full pl-4 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <div className="mt-4 text-gray-500 text-sm justify-between flex">
          <NavLink to="/login" className="hover:text-blue-600">
            Se connecter
          </NavLink>
        </div>
      </div>
    </div>
  );
};
