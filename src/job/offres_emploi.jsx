// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// export const JobOffersPage = () => {
//   const [offres, setOffres] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState("En cours");

//   useEffect(() => {
//     const fetchOffres = async () => {
//       try {
//         const res = await fetch("http://localhost:3000/api/v1/jobs");
//         if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
//         const data = await res.json();
//         setOffres(data);
//       } catch (err) {
//         console.error("Erreur récupération offres d’emploi :", err);
//         setOffres([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOffres();
//   }, []);

//   const offresFiltrees = offres.filter((offre) => {
//     const matchQuery =
//       searchQuery === "" ||
//       offre.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (offre.reference && offre.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
//       (offre.organization &&
//         offre.organization.toLowerCase().includes(searchQuery.toLowerCase()));
//     let matchStatus = true;
//     if (filterStatus === "En cours") {
//       matchStatus = !offre.expired;
//     } else if (filterStatus === "Moins de 3 jours") {
//       const now = new Date();
//       const inserted = new Date(offre.dateInserted);
//       matchStatus = (now - inserted) / (1000 * 60 * 60 * 24) <= 3;
//     } else if (filterStatus === "Expirée") {
//       matchStatus = offre.expired === true;
//     } else if (filterStatus === "Non précisé") {
//       matchStatus = !offre.status;
//     }
//     return matchQuery && matchStatus;
//   });

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <h1 className="text-3xl font-bold mb-4">Offres d’emploi</h1>

//       <div className="mb-6 bg-blue-100 border-l-8 border-blue-500 p-4 text-sm sm:text-base rounded">
//         <p className="font-bold mb-1">AVIS AUX CANDIDATS</p>
//         <p>
//           Les offres d’emploi publiées sont certifiées. Aucun frais n’est exigé pour le dépôt des candidatures,
//           ni pour aucun autre motif (interview ou formation). Veuillez{" "}
//           <strong>NE PAS ENVOYER D’ARGENT</strong> sous quelque forme que ce soit
//           (cash, virement, transfert Western Union, mobile money,…). Merci de signaler toute demande suspecte.
//         </p>
//       </div>

//       {/* Barre de recherche + filtre statut */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Fonction, référence ou organisme"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="border px-4 py-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <select
//           name="filterStatus"
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//           className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="En cours">En cours</option>
//           <option value="Moins de 3 jours">Moins de 3 jours</option>
//           <option value="Expirée">Expirée</option>
//           <option value="Non précisé">Non précisé</option>
//         </select>
//       </div>

//       {/* Table responsive */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse text-left min-w-[600px]">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="px-4 py-2">Fonction</th>
//               <th className="px-4 py-2">Organisme</th>
//               <th className="px-4 py-2">Lieu</th>
//               <th className="px-4 py-2">Insérée</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading && (
//               <tr>
//                 <td colSpan={4} className="px-4 py-2 text-center">
//                   Chargement des offres…
//                 </td>
//               </tr>
//             )}
//             {!loading && offresFiltrees.length === 0 && (
//               <tr>
//                 <td colSpan={4} className="px-4 py-2 text-center">
//                   Aucune offre d’emploi trouvée.
//                 </td>
//               </tr>
//             )}
//             {!loading &&
//               offresFiltrees.map((offre) => (
//                 <tr
//                   key={offre.id}
//                   className="hover:bg-gray-100 border-b border-gray-400"
//                 >
//                   <td className="px-4 py-2">
//                     <Link
//                       to={`/offre/${offre.id}`}
//                       className="font-bold text-gray-700 hover:text-blue-600"
//                     >
//                       {offre.title}
//                     </Link>
//                     {offre.reference && (
//                       <div className="text-sm text-gray-500 font-semibold">{offre.reference}</div>
//                     )}
//                   </td>
//                   <td className="px-4 py-2">{offre.organisme}</td>
//                   <td className="px-4 py-2">{offre.lieu}</td>
//                   <td className="px-4 py-2">
//                     {new Date(offre.createdAt).toLocaleDateString("fr-FR")}
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export const JobOffersPage = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("En cours");

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/jobs");
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        const data = await res.json();
        setOffres(data);
      } catch (err) {
        console.error("Erreur récupération offres :", err);
        setOffres([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffres();
  }, []);

  const offresFiltrees = offres.filter((offre) => {
    const matchQuery =
      searchQuery === "" ||
      offre.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (offre.reference && offre.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (offre.organisme && offre.organisme.toLowerCase().includes(searchQuery.toLowerCase()));
    let matchStatus = true;
    if (filterStatus === "En cours") matchStatus = !offre.expired;
    else if (filterStatus === "Moins de 3 jours") {
      const now = new Date();
      const inserted = new Date(offre.dateInserted);
      matchStatus = (now - inserted) / (1000 * 60 * 60 * 24) <= 3;
    } else if (filterStatus === "Expirée") matchStatus = offre.expired === true;
    else if (filterStatus === "Non précisé") matchStatus = !offre.status;
    return matchQuery && matchStatus;
  });
// lg:px-8  mx-auto px-4 sm:px-6
  return (
    <div className="py-8 md:px-48">
      <h1 className="text-3xl font-bold mb-4">Offres d’emploi</h1>

      <div className="mb-6 bg-blue-100 border-l-12 border-blue-800 p-4 text-sm sm:text-base rounded">
        <p className="font-bold mb-1">AVIS AUX CANDIDATS</p>
        <p>
          Les offres d’emploi publiées sont certifiées. Aucun frais n’est exigé pour le dépôt des candidatures,
          ni pour aucun autre motif (interview ou formation). Veuillez{" "}
          <strong>NE PAS ENVOYER D’ARGENT</strong> sous quelque forme que ce soit. Merci de signaler toute demande suspecte.
        </p>
      </div>

      {/* Barre recherche + filtre */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Fonction, référence ou organisme"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded flex-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          name="filterStatus"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border px-4 py-2 rounded w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="En cours">En cours</option>
          <option value="Moins de 3 jours">Moins de 3 jours</option>
          <option value="Expirée">Expirée</option>
          <option value="Non précisé">Non précisé</option>
        </select>
      </div>

      {/* Table responsive */}
      <div className="overflow-x-auto md:overflow-x-visible">
        <table className="w-full border-collapse text-left min-w-[600px] hidden md:table">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Fonction</th>
              <th className="px-4 py-2">Organisme</th>
              <th className="px-4 py-2">Lieu</th>
              <th className="px-4 py-2">Insérée</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center">
                  Chargement des offres…
                </td>
              </tr>
            )}
            {!loading && offresFiltrees.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center">
                  Aucune offre d’emploi trouvée.
                </td>
              </tr>
            )}
            {!loading &&
              offresFiltrees.map((offre) => (
                <tr key={offre.id} className="hover:bg-gray-100 border-b border-gray-400">
                  <td className="px-4 py-2 w-1/2 min-w-[200px]">
                    <Link
                      to={`/offre/${offre.id}`}
                      className="font-bold text-gray-700 "
                    >
                      {offre.title}
                    </Link>
                    {offre.reference && (
                      <div className="text-sm text-gray-500 font-semibold">{offre.reference}</div>
                    )}
                  </td>
                  <td className="px-4 py-2">{offre.organisme}</td>
                  <td className="px-4 py-2">{offre.lieu}</td>
                  <td className="px-4 py-2">
                    {new Date(offre.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Version mobile */}
        <div className="md:hidden space-y-4">
          {loading && <p>Chargement des offres…</p>}
          {!loading && offresFiltrees.length === 0 && <p>Aucune offre d’emploi trouvée.</p>}
          {!loading &&
            offresFiltrees.map((offre) => (
              <div key={offre.id} className="border rounded p-4 bg-white shadow-sm">
                <p className="font-bold text-gray-700">{offre.title}</p>
                {offre.reference && (
                  <p className="text-sm text-gray-500 font-semibold">{offre.reference}</p>
                )}
                <p className="text-gray-600">{offre.organisme}</p>
                <p className="text-gray-600">{offre.lieu}</p>
                <p className="text-gray-600">
                  {new Date(offre.createdAt).toLocaleDateString("fr-FR")}
                </p>
                <Link
                  to={`/offre/${offre.id}`}
                  className="text-blue-600 font-semibold mt-2 inline-block"
                >
                  Voir détails
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
