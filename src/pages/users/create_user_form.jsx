import React, { useState } from "react";
import { useAuthStore } from "../../provider/useAuthStore";

export const CreateUserForm = () => {
  const token = useAuthStore((state) => state.token);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
    phone: "",
    avatarUrl: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    "SUPERADMIN",
    "ADMIN",
    "CAISSIER",
    "DELEGUE",
    "CUSTOMER",
    "SELLER",
    "DELIVERY",
    "COMPANY",
    "USER",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setMessage("Utilisateur non authentifié");

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/api/admin/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      setMessage(`Utilisateur créé avec succès : ${data.name} (Code: ${data.code})`);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "USER",
        phone: "",
        avatarUrl: "",
      });
    } catch (err) {
      setMessage(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Créer un utilisateur</h2>

      {message && <p className={`mb-4 text-center ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="name" placeholder="Nom" value={formData.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input type="text" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        <input type="text" name="avatarUrl" placeholder="URL Avatar" value={formData.avatarUrl} onChange={handleChange} className="w-full border px-3 py-2 rounded" />

        <select name="role" value={formData.role} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
          {loading ? "Création..." : "Créer l'utilisateur"}
        </button>
      </form>
    </div>
  );
};
