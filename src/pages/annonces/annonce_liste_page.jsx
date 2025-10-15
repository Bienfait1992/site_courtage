// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// export default function AnnoncesList() {
//   const [annonces, setAnnonces] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Filtres
//   const [typeBien, setTypeBien] = useState("");
//   const [ville, setVille] = useState("");
//   const [prixMin, setPrixMin] = useState("");
//   const [prixMax, setPrixMax] = useState("");
//   const [chambres, setChambres] = useState("");
//   const [sort, setSort] = useState(""); // "prixAsc", "prixDesc", "recent"

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const annoncesPerPage = 8;

//   const formatCurrency = (prix, currency) => {
//     const symbols = { USD: "$", EUR: "€", CDF: "FC" };
//     return `${symbols[currency] || currency} ${prix}`;
//   };

//   useEffect(() => {
//     const fetchAnnonces = async () => {
//       try {
//         const res = await fetch("http://localhost:3000/api/v1/annonces");
//         const data = await res.json();
//         setAnnonces(data.annonces || []);
//         setFiltered(data.annonces || []);
//       } catch (error) {
//         console.error("Erreur lors du chargement des annonces :", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAnnonces();
//   }, []);

//   // Filtrage dynamique
//   useEffect(() => {
//     let result = [...annonces];

//     if (typeBien) result = result.filter((a) => a.typeBien === typeBien);
//     if (ville) result = result.filter((a) =>
//       a.ville.toLowerCase().includes(ville.toLowerCase())
//     );
//     if (prixMin) result = result.filter((a) => Number(a.prix) >= Number(prixMin));
//     if (prixMax) result = result.filter((a) => Number(a.prix) <= Number(prixMax));
//     if (chambres) result = result.filter((a) =>
//       Number(a.nombreChambres) >= Number(chambres)
//     );

//     // Tri
//     if (sort === "prixAsc") result.sort((a, b) => a.prix - b.prix);
//     if (sort === "prixDesc") result.sort((a, b) => b.prix - a.prix);
//     if (sort === "recent") result.sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );

//     setFiltered(result);
//     setCurrentPage(1); // reset page
//   }, [typeBien, ville, prixMin, prixMax, chambres, sort, annonces]);

//   if (loading) return <p className="text-center mt-10">Chargement...</p>;

//   // Pagination logic
//   const indexOfLast = currentPage * annoncesPerPage;
//   const indexOfFirst = indexOfLast - annoncesPerPage;
//   const currentAnnonces = filtered.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filtered.length / annoncesPerPage);

//   return (
//     <div className="container mx-auto p-4 md:px-48">
//       <h1 className="text-3xl font-bold mb-6 text-center">Toutes les annonces</h1>

//       {/* Filtre & Tri */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         <select className="border p-2 rounded" value={typeBien} onChange={(e) => setTypeBien(e.target.value)}>
//           <option value="">Type de bien</option>
//           <option value="MAISON">Maison</option>
//           <option value="APPARTEMENT">Appartement</option>
//           <option value="PARCELLE">Parcelle</option>
//           <option value="VILLA">Villa</option>
//           <option value="BUREAU">Bureau</option>
//           <option value="IMMEUBLE">Immeuble</option>
//         </select>

//         <input
//           type="text"
//           placeholder="Ville"
//           className="border p-2 rounded"
//           value={ville}
//           onChange={(e) => setVille(e.target.value)}
//         />

//         <input
//           type="number"
//           placeholder="Prix min"
//           className="border p-2 rounded"
//           value={prixMin}
//           onChange={(e) => setPrixMin(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Prix max"
//           className="border p-2 rounded"
//           value={prixMax}
//           onChange={(e) => setPrixMax(e.target.value)}
//         />

//         <select className="border p-2 rounded" value={chambres} onChange={(e) => setChambres(e.target.value)}>
//           <option value="">Chambres min</option>
//           <option value="1">1+</option>
//           <option value="2">2+</option>
//           <option value="3">3+</option>
//         </select>

//         <select className="border p-2 rounded" value={sort} onChange={(e) => setSort(e.target.value)}>
//           <option value="">Trier par</option>
//           <option value="prixAsc">Prix croissant</option>
//           <option value="prixDesc">Prix décroissant</option>
//           <option value="recent">Les plus récents</option>
//         </select>
//       </div>

//       {/* Liste des annonces */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//         {currentAnnonces.map((annonce) => (
//           <div
//             key={annonce.id}
//             className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition"
//           >
//             {annonce.images && annonce.images.length > 0 && (
//               <img
//                 src={`http://localhost:3000${annonce.images[0].url}`}
//                 alt={annonce.titre}
//                 className="w-full h-48 object-cover rounded-xl mb-3"
//               />
//             )}
//             <h2 className="text-[16px] font-semibold">{annonce.titre}</h2>
//             <p className="text-gray-600 truncate">{annonce.description}</p>
//             <p className="text-blue-600 font-bold mt-2">
//               {formatCurrency(annonce.prix, annonce.currency)}
//             </p>
//             <Link
//               to={`/annonces/${annonce.id}`}
//               className="block mt-4 text-center bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
//             >
//               Voir détails
//             </Link>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-6 gap-2">
//           {[...Array(totalPages)].map((_, i) => (
//             <button
//               key={i}
//               className={`px-3 py-1 rounded ${
//                 currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
//               }`}
//               onClick={() => setCurrentPage(i + 1)}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AnnoncesList() {
  const [annonces, setAnnonces] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtres
  const [typeBien, setTypeBien] = useState("");
  const [ville, setVille] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [chambres, setChambres] = useState("");
  const [mode, setMode] = useState(""); // VENTE ou LOCATION
  const [sort, setSort] = useState(""); // "prixAsc", "prixDesc", "recent"

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const annoncesPerPage = 12;

  const formatCurrency = (prix, currency) => {
    const symbols = { USD: "$", EUR: "€", CDF: "FC" };
    return `${symbols[currency] || currency} ${prix}`;
  };

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/annonces");
        const data = await res.json();
        setAnnonces(data.annonces || []);
        setFiltered(data.annonces || []);
      } catch (error) {
        console.error("Erreur lors du chargement des annonces :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnonces();
  }, []);

  // Filtrage dynamique
  useEffect(() => {
    let result = [...annonces];

    if (typeBien) result = result.filter((a) => a.typeBien === typeBien);
    if (ville) result = result.filter((a) =>
      a.ville.toLowerCase().includes(ville.toLowerCase())
    );
    if (prixMin) result = result.filter((a) => Number(a.prix) >= Number(prixMin));
    if (prixMax) result = result.filter((a) => Number(a.prix) <= Number(prixMax));
    if (chambres) result = result.filter((a) =>
      Number(a.nombreChambres) >= Number(chambres)
    );
    if (mode) result = result.filter((a) => a.mode === mode);

    // Tri
    if (sort === "prixAsc") result.sort((a, b) => a.prix - b.prix);
    if (sort === "prixDesc") result.sort((a, b) => b.prix - a.prix);
    if (sort === "recent") result.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setFiltered(result);
    setCurrentPage(1); // reset page
  }, [typeBien, ville, prixMin, prixMax, chambres, mode, sort, annonces]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  // Pagination logic
  const indexOfLast = currentPage * annoncesPerPage;
  const indexOfFirst = indexOfLast - annoncesPerPage;
  const currentAnnonces = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / annoncesPerPage);

  return (
    <div className="container mx-auto p-4 md:px-48">
      <h1 className="text-3xl font-bold mb-6 text-center">Toutes les annonces</h1>

      {/* Filtre & Tri */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select className="border p-2 rounded" value={typeBien} onChange={(e) => setTypeBien(e.target.value)}>
          <option value="">Type de bien</option>
          <option value="MAISON">Maison</option>
          <option value="APPARTEMENT">Appartement</option>
          <option value="PARCELLE">Parcelle</option>
          <option value="VILLA">Villa</option>
          <option value="BUREAU">Bureau</option>
          <option value="IMMEUBLE">Immeuble</option>
        </select>

        <input
          type="text"
          placeholder="Ville"
          className="border p-2 rounded"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
        />

        <input
          type="number"
          placeholder="Prix min"
          className="border p-2 rounded"
          value={prixMin}
          onChange={(e) => setPrixMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Prix max"
          className="border p-2 rounded"
          value={prixMax}
          onChange={(e) => setPrixMax(e.target.value)}
        />

        <select className="border p-2 rounded" value={chambres} onChange={(e) => setChambres(e.target.value)}>
          <option value="">Chambres min</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>

        <select className="border p-2 rounded" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="">Mode</option>
          <option value="VENTE">Vente</option>
          <option value="LOCATION">Location</option>
        </select>

        <select className="border p-2 rounded" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Trier par</option>
          <option value="prixAsc">Prix croissant</option>
          <option value="prixDesc">Prix décroissant</option>
          <option value="recent">Les plus récents</option>
        </select>
      </div>

      {/* Liste des annonces */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {currentAnnonces.map((annonce) => (
          <div
            key={annonce.id}
            className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition relative"
          >
            {/* Badge Mode */}
            <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded ${annonce.mode === "VENTE" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}`}>
              {annonce.mode}
            </span>

            {annonce.images && annonce.images.length > 0 && (
              <img
                src={`http://localhost:3000${annonce.images[0].url}`}
                alt={annonce.titre}
                className="w-full h-48 object-cover rounded-xl mb-3"
              />
            )}
            <h2 className="text-[16px] font-semibold">{annonce.titre}</h2>
            <p className="text-gray-600 truncate">{annonce.description}</p>
            <p className="text-blue-600 font-bold mt-2">
              {formatCurrency(annonce.prix, annonce.currency)}
            </p>
            <Link
              to={`/annonces/${annonce.id}`}
              className="block mt-4 text-center bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Voir détails
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
