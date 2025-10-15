


import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/jobs/${id}`);
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError("Impossible de charger l'offre d'emploi");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="p-4 sm:p-6 md:px-48 md:py-8  bg-white ">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">{job.title}</h1>

      {/* <div className=" flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mb-4 gap-2">
        <span>Publiée le {new Date(job.createdAt).toLocaleDateString("fr-FR")}</span>
        <span>Réf : {job.reference || "N/A"}</span>
      </div> */}
             <div className="space-x-2 mb-4 ">
       <span className="text-sm text-gray-400 mb-6">
        Publiée le {new Date(job.createdAt).toLocaleDateString("fr-FR")}  | 
      </span>
      <span className="text-gray-500 mb-4">
        Réf : {job.reference || "N/A"} 
      </span>
      </div>

      <div className="mb-4">
        <h2 className="font-bold text-lg sm:text-xl mb-1">Lieu</h2>
        <p className="mb-2 border-b border-blue-300 pb-2">{job.lieu}</p>

        <h2 className="font-bold text-lg sm:text-xl mb-1">Organisme</h2>
        <p className="mb-2 border-b border-blue-300 pb-2">{job.organisme}</p>

        <h2 className="font-bold text-lg sm:text-xl mb-1">Description</h2>
        <p className="text-justify mb-4">{job.description}</p>
      </div>

      {/* <div className="mb-6">
        <h2 className="font-bold text-lg sm:text-xl mb-2 border-b border-blue-300 pb-1">Fichiers joints</h2>
        {job.attachments && job.attachments.length > 0 ? (
          <ul className="list-disc ml-5 space-y-1">
            {job.attachments.map((file) => (
              <li key={file.id} className="flex items-center gap-2">
                <FaFilePdf className="text-red-600 flex-shrink-0" />
                <a
                  href={`http://localhost:3000${file.url}`}
                  download={file.filename}
                  className="text-blue-600 hover:underline break-words"
                >
                  {file.filename}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun fichier joint.</p>
        )}
      </div> */}

 {job.attachments && job.attachments.length > 0 ? (
  <object
    data={`http://localhost:3000${job.attachments[0].url}`}
    type="application/pdf"
    width="100%"
    height="600px"
  >
    <p>
      Votre navigateur ne prend pas en charge l'affichage des fichiers PDF. 
      Vous pouvez télécharger le fichier en cliquant{" "}
      <a href={`http://localhost:3000${job.attachments[0].url}`}>
        ici
      </a>.
    </p>
  </object>
) : (
  <p>Aucun fichier joint.</p>
)}



      {job.contact && (
        <div className="bg-gray-50 p-4 rounded mb-6 border border-blue-100">
          <h3 className="font-semibold mb-1">Contact / Candidature</h3>
          <p>{job.contact}</p>
        </div>
      )}

      <Link
        to="/offres"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        ← Retour aux offres
      </Link>
    </div>
  );
};

export default JobDetail;
