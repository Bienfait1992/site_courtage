import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../provider/useAuthStore";

const JobFormPage = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [jobData, setJobData] = useState({
    title: "",
    reference: "",
    organisme: "",
    lieu: "",
    description: "",
    contact: "",
    categoryId: "",
    expiresAt: "",
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [loadingCategory, setLoadingCategory] = useState(false);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setJobs(data);
      else setJobs([]);
    } catch (err) {
      console.error(err);
      setJobs([]);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/job-categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
      else setCategories([]);
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchJobs();
      fetchCategories();
    }
  }, [token]);

  const handleJobChange = (e) =>
    setJobData({ ...jobData, [e.target.name]: e.target.value });

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("⚠️ Le fichier dépasse la limite de 10 Mo !");
        return;
      }
      if (file.type !== "application/pdf") {
        alert("Seuls les fichiers PDF sont autorisés !");
        return;
      }
      setPdfFile(file);
    }
  };

  // Submit job (create/update)
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      Object.keys(jobData).forEach((key) => {
        const value = jobData[key];
        if (value && value.toString().trim() !== "") {
          formData.append(key, key === "categoryId" ? Number(value) : value);
        }
      });

      if (pdfFile) formData.append("pdf", pdfFile);

      const url = editingJob
        ? `http://localhost:3000/api/v1/jobs/${editingJob.id}`
        : "http://localhost:3000/api/v1/jobs";

      const method = editingJob ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const newJob = await res.json();

      // Update jobs list
      setJobs((prev) => {
        if (editingJob) {
          return prev.map((j) => (j.id === newJob.id ? newJob : j));
        }
        return [newJob, ...prev];
      });

      // Reset form
      setJobData({
        title: "",
        reference: "",
        organisme: "",
        lieu: "",
        description: "",
        contact: "",
        categoryId: "",
        expiresAt: "",
      });
      setPdfFile(null);
      setEditingJob(null);
    } catch (err) {
      console.error(err);
      setError("Impossible de créer ou modifier l'offre");
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobData({
      title: job.title || "",
      reference: job.reference || "",
      organisme: job.organisme || "",
      lieu: job.lieu || "",
      description: job.description || "",
      contact: job.contact || "",
      categoryId: job.categoryId || "",
      expiresAt: job.expiresAt ? job.expiresAt.split("T")[0] : "",
    });
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette offre ?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/v1/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur suppression");
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer l'offre");
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setLoadingCategory(true);

    try {
      const url = editingCategory
        ? `http://localhost:3000/api/v1/job-categories/${editingCategory.id}`
        : "http://localhost:3000/api/v1/job-categories";

      const res = await fetch(url, {
        method: editingCategory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erreur serveur");
      }

      setNewCategoryName("");
      setEditingCategory(null);
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setLoadingCategory(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des offres d’emploi</h1>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <button
          onClick={() => setShowCategoryModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Ajouter une catégorie
        </button>
        {/* <button
          onClick={() => {
            setEditingJob(null);
            setJobData({
              title: "",
              reference: "",
              organisme: "",
              lieu: "",
              description: "",
              contact: "",
              categoryId: "",
              expiresAt: "",
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Créer une offre
        </button> */}
      </div>

      {/* Modal catégorie */}
      {showCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white p-6 rounded w-full max-w-md mx-2">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
            </h2>
            <form onSubmit={handleCategorySubmit} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Nom de la catégorie"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="border p-2 rounded"
              />
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <button
                  type="submit"
                  disabled={loadingCategory}
                  className="bg-green-600 text-white px-4 py-2 rounded flex-1"
                >
                  {loadingCategory
                    ? "En cours..."
                    : editingCategory
                    ? "Modifier"
                    : "Créer"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    setNewCategoryName("");
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded flex-1"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Formulaire job */}
      <div className="bg-gray-50 p-4 rounded mb-6">
        <h2 className="text-xl font-bold mb-4">
          {editingJob ? "Modifier" : "Créer"} une offre
        </h2>
        <form onSubmit={handleJobSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Titre du poste"
            value={jobData.title}
            onChange={handleJobChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="text"
            name="reference"
            placeholder="Référence"
            value={jobData.reference}
            onChange={handleJobChange}
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            name="organisme"
            placeholder="Organisme"
            value={jobData.organisme}
            onChange={handleJobChange}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="text"
            name="lieu"
            placeholder="Lieu"
            value={jobData.lieu}
            onChange={handleJobChange}
            className="w-full border rounded p-2"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={jobData.description}
            onChange={handleJobChange}
            className="w-full border rounded p-2"
            rows={4}
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            value={jobData.contact}
            onChange={handleJobChange}
            className="w-full border rounded p-2"
          />
          <select
            name="categoryId"
            value={jobData.categoryId}
            onChange={handleJobChange}
            className="w-full border rounded p-2"
          >
            <option value="">-- Choisir une catégorie --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="expiresAt"
            value={jobData.expiresAt}
            onChange={handleJobChange}
            className="w-full border rounded p-2"
          />
          <input type="file" accept="application/pdf" onChange={handlePdfChange} />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            {loading
              ? "Enregistrement..."
              : editingJob
              ? "Modifier l'offre"
              : "Créer l'offre"}
          </button>
        </form>
      </div>

      {/* Liste jobs */}
      <div className="hidden md:block">
        <table className="w-full border-collapse border bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Titre</th>
              <th className="border p-2">Catégorie</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="border p-2">{job.title}</td>
                <td className="border p-2">
                  {job.category?.name ||
                    categories.find((cat) => cat.id === Number(job.categoryId))
                      ?.name ||
                    "Non renseignée"}
                </td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEditJob(job)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={3} className="p-2 text-center">
                  Aucune offre pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Version mobile en cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="border rounded-lg p-4 shadow bg-white flex flex-col"
          >
            <p className="font-semibold text-lg">{job.title}</p>
            <p className="text-sm text-gray-600 mb-2">
              Catégorie :{" "}
              {job.category?.name ||
                categories.find((cat) => cat.id === Number(job.categoryId))
                  ?.name ||
                "Non renseignée"}
            </p>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => handleEditJob(job)}
                className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded text-sm"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDeleteJob(job.id)}
                className="flex-1 bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            Aucune offre pour le moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default JobFormPage;
