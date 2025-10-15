import React, { useState } from "react";
import { useAuthStore } from "../../provider/useAuthStore";

export const CreateRegionForm = () => {
  const token = useAuthStore((state) => state.token);
  const [formData, setFormData] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:3000/api/v1/regions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      setMessage(`Région "${data.name}" créée avec succès`);
      setFormData({ name: "" });
    } catch (err) {
      setMessage(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold">Créer une Région</h3>
      {message && (
        <div className={`p-2 rounded ${message.startsWith("Région") ? "bg-green-100" : "bg-red-100"}`}>
          {message}
        </div>
      )}

      <input
        type="text"
        name="name"
        placeholder="Nom de la région"
        value={formData.name}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Création..." : "Créer Région"}
      </button>
    </form>
  );
};
