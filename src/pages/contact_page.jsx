import React, { useState } from "react";
import { useAuthStore } from "../provider/useAuthStore";

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const token = useAuthStore((state) => state.token);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const { name, email, subject, message } = formData;

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await fetch("http://localhost:3000/api/v1/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, subject, message }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(data.message || "Message envoyé avec succès !");
      // 🔥 Réinitialiser les champs du formulaire
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } else {
      setError(data.message || "Une erreur est survenue.");
    }
  } catch (err) {
    console.error(err);
    setError("Erreur lors de l'envoi du message.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container mx-auto px-4 md:px-48 md:py-8 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Contactez-nous
      </h1>
      <p className="text-center text-gray-600 mb-10">
        Vous avez une question, une suggestion ou besoin d’informations ? 
        Remplissez le formulaire ci-dessous ou utilisez nos coordonnées.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Formulaire */}
        <form
          className="space-y-4 bg-white shadow-lg rounded-lg p-6"
          onSubmit={handleSubmit}
        >
         {success && (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
    {success}
  </div>
)}

{error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
   {error}
  </div>
)}


          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              name="name"
              placeholder="Votre nom"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Votre adresse email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sujet</label>
            <input
              type="text"
              name="subject"
              placeholder="Sujet de votre message"
              value={formData.subject}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              name="message"
              rows="5"
              placeholder="Votre message..."
              value={formData.message}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </form>

        {/* Coordonnées */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-2">Nos coordonnées</h2>
          <p className="text-gray-600">N’hésitez pas à nous contacter via nos différents canaux :</p>
          <div>
            <h3 className="font-bold">Adresse :</h3>
            <p className="text-gray-600">123 Avenue du Commerce, Kinshasa, RDC</p>
          </div>
          <div>
            <h3 className="font-bold">Téléphone :</h3>
            <p className="text-gray-600">+243 812 345 678</p>
          </div>
          <div>
            <h3 className="font-bold">Email :</h3>
            <p className="text-gray-600">contact@tonsite.com</p>
          </div>
          <div>
            <h3 className="font-bold">Horaires :</h3>
            <p className="text-gray-600">
              Lun - Ven : 8h00 - 17h00 <br />
              Sam : 9h00 - 13h00
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
