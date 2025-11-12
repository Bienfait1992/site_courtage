// import React, { useEffect, useState } from "react";
// import { useAuthStore } from "../../provider/useAuthStore";

// export default function SouscriptionsAnnonces() {
//   const { token } = useAuthStore();
//   const [souscriptions, setSouscriptions] = useState([]);
//   const [annonces, setAnnonces] = useState([]);
//   const [selectedSouscription, setSelectedSouscription] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [loadingAnnonces, setLoadingAnnonces] = useState(false);

//   // Charger toutes les souscriptions de l'utilisateur
//   useEffect(() => {
//     const fetchSouscriptions = async () => {
//       if (!token) return;
//       setLoading(true);
//       try {
//         const response = await fetch("http://localhost:3000/api/v1/souscriptions", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setSouscriptions(data);
//         } else {
//           console.error("Erreur:", data.message);
//         }
//       } catch (err) {
//         console.error("Erreur réseau :", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSouscriptions();
//   }, [token]);

//   // Charger les annonces correspondant à une souscription
//   const handleAfficherAnnonces = async (id) => {
//     setSelectedSouscription(id);
//     setLoadingAnnonces(true);
//     try {
//       const response = await fetch(`http://localhost:3000/api/v1/souscriptions/${id}/annonces`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setAnnonces(data.annonces);
//       } else {
//         alert("Erreur : " + data.message);
//       }
//     } catch (err) {
//       console.error("Erreur de récupération des annonces :", err);
//       alert("Erreur réseau ou serveur");
//     } finally {
//       setLoadingAnnonces(false);
//     }
//   };

//   return (
//     <div className="p-6 md:px-48 md:py-8">
//       <h2 className="text-xl font-semibold mb-4 text-gray-700">Mes Souscriptions</h2>

//       {loading ? (
//         <p>Chargement des souscriptions...</p>
//       ) : souscriptions.length === 0 ? (
//         <p>Aucune souscription trouvée.</p>
//       ) : (
//         <div className="space-y-4">
//           {souscriptions.map((sous) => (
//             <div
//               key={sous.id}
//               className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
//             >
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="font-medium text-gray-800">
//                     Type de bien : <span className="text-indigo-600">{sous.criteres.typeBien}</span>
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     Mode : {sous.criteres.mode} — Ville : {sous.criteres.ville || "Non précisé"}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => handleAfficherAnnonces(sous.id)}
//                   className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
//                 >
//                   Voir annonces
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {selectedSouscription && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold text-gray-700 mb-3">
//             Annonces correspondant à la souscription #{selectedSouscription}
//           </h3>

//           {loadingAnnonces ? (
//             <p>Chargement des annonces...</p>
//           ) : annonces.length === 0 ? (
//             <p>Aucune annonce correspondante.</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {annonces.map((a) => (
//                 <div
//                   key={a.id}
//                   className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
//                 >
//                   <h4 className="font-medium text-gray-800 mb-2">
//                     {a.titre || "Annonce sans titre"}
//                   </h4>
//                   <p className="text-sm text-gray-600 mb-1">
//                     Prix : {a.prix} {a.currency || "USD"}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-1">
//                     Ville : {a.ville || "—"}
//                   </p>
//                   <p className="text-sm text-gray-600 mb-2">
//                     Superficie : {a.superficie || "—"} m²
//                   </p>
//                   <button className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700">
//                     Voir détails
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../provider/useAuthStore";
import { Link } from "react-router-dom";

export default function SouscriptionsAnnonces() {
  const { token } = useAuthStore();
  const [souscriptions, setSouscriptions] = useState([]);
  const [annoncesOuvertes, setAnnoncesOuvertes] = useState({}); // { idSouscription: [annonces] }
  const [loading, setLoading] = useState(false);
  const [loadingAnnonces, setLoadingAnnonces] = useState({}); // { idSouscription: bool }

  const formatCurrency = (prix, currency) => {
    const symbols = { USD: "$", EUR: "€", CDF: "FC" };
    return `${symbols[currency] || currency} ${prix}`;
  };


  // Charger toutes les souscriptions de l'utilisateur
  useEffect(() => {
    const fetchSouscriptions = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/v1/souscriptions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setSouscriptions(data);
        else console.error("Erreur:", data.message);
      } catch (err) {
        console.error("Erreur réseau :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSouscriptions();
  }, [token]);

  // Gérer le clic sur "Voir annonces" / "Fermer"
  const toggleAnnonces = async (id) => {
    // Si déjà ouvert → on ferme
    if (annoncesOuvertes[id]) {
      setAnnoncesOuvertes((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      return;
    }

    // Sinon → on ouvre et on charge
    setLoadingAnnonces((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`http://localhost:3000/api/v1/souscriptions/${id}/annonces`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        // setAnnoncesOuvertes((prev) => ({ ...prev, [id]: data.annonces }));
         // Ici on stocke à la fois les annonces normales et les suggestions
      setAnnoncesOuvertes((prev) => ({
        ...prev,
        [id]: {
          annonces: data.annonces,
          suggestions: data.suggestions || [], // <-- suggestions ajoutées ici
        },
      }));
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (err) {
      console.error("Erreur de récupération des annonces :", err);
      alert("Erreur réseau ou serveur");
    } finally {
      setLoadingAnnonces((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
  <div className="p-6 md:px-48 md:py-8">
    <h2 className="text-3xl sm:text-4xl font-bold text-start mb-8 text-[#005B9C]">
      Mes Souscriptions
    </h2>

    {loading ? (
      <p>Chargement des souscriptions...</p>
    ) : souscriptions.length === 0 ? (
      <p>Aucune souscription trouvée.</p>
    ) : (
      <div className="space-y-6">
        {souscriptions.map((sous) => {
          const isOuvert = !!annoncesOuvertes[sous.id];
          const isLoading = loadingAnnonces[sous.id];

          return (
            <div
              key={sous.id}
              className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">
                    Type de bien : <span className="text-[#2EB5F9]">{sous.criteres.typeBien}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Mode : {sous.criteres.mode} — Ville : {sous.criteres.ville || "Non précisé"}
                  </p>
                </div>
                <button
                  onClick={() => toggleAnnonces(sous.id)}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isOuvert
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-[#2EB5F9] hover:bg-[#005B9C] hover:cursor-pointer"
                  } transition`}
                >
                  {isOuvert ? "Fermer" : "Voir annonces"}
                </button>
              </div>

              {/* Affichage fluide des annonces */}
              {isOuvert && (
                <div className="mt-4 border-t pt-4">
                  {isLoading ? (
                    <p>Chargement des annonces...</p>
                  ) : annoncesOuvertes[sous.id]?.length === 0 ? (
                    <p>Aucune annonce correspondante.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {annoncesOuvertes[sous.id].annonces?.map((a) => (
                        <div
                          key={a.id}
                          className="flex justify-between border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition items-center"
                        >
                          <div className="flex-1 pr-4">
                            <h4 className="font-medium text-gray-800 mb-2">
                              {a.titre || "Annonce sans titre"}
                            </h4>
                            <p className="text-lg mb-2">
                              <span className="font-semibold text-sm">
                                {sous.criteres.mode?.toLowerCase() === "location"
                                  ? "Montant du loyer :"
                                  : "Prix de vente :"}
                              </span>{" "}
                              <span className="text-blue-600 font-normal text-sm">
                                {sous.criteres.mode?.toLowerCase() === "location"
                                  ? a.loyer
                                    ? `${a.loyer} ${a.currency || "USD"}`
                                    : "Non renseigné"
                                  : a.prix
                                  ? `${a.prix} ${a.currency || "USD"}`
                                  : "Non renseigné"}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              Ville : {a.ville || "—"}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              Superficie : {a.superficie || "—"} m²
                            </p>
                            <button className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700">
                              <Link to={`/annonces/${a.id}`}>Voir détails</Link>
                            </button>
                          </div>

                          {a.images && a.images.length > 0 && (
                            <img
                              src={`http://localhost:3000${a.images[0].url}`}
                              alt={a.titre}
                              className="w-24 h-24 object-cover rounded-xl"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggestions d'annonces */}
                  {/* {annoncesOuvertes[sous.id]?.suggestions?.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        Suggestions pour vous
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {annoncesOuvertes[sous.id].suggestions.map((sugg) => (
                          <div
                            key={sugg.id}
                            className="flex justify-between border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition items-center"
                          >
                            <div className="flex-1 pr-4">
                              <h4 className="font-medium text-gray-800 mb-2">
                                {sugg.titre || "Annonce sans titre"}
                              </h4>
                              <p className="text-sm text-gray-600 mb-1">
                                Ville : {sugg.ville || "—"}
                              </p>
                              <p className="text-sm text-gray-600 mb-2">
                                Superficie : {sugg.superficie || "—"} m²
                              </p>
                              <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">
                                <Link to={`/annonces/${sugg.id}`}>Voir détails</Link>
                              </button>
                            </div>
                            {sugg.images && sugg.images.length > 0 && (
                              <img
                                src={`http://localhost:3000${sugg.images[0].url}`}
                                alt={sugg.titre}
                                className="w-24 h-24 object-cover rounded-xl"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}

                                {annoncesOuvertes[sous.id]?.suggestions?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">
                    Suggestions pour vous
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {annoncesOuvertes[sous.id]?.suggestions?.map((sugg) => (
                      <div
                        key={sugg.id}
                        className="flex justify-between border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition items-center"
                      >
                        <div className="flex-1 pr-4">
                          <h4 className="font-medium text-gray-800 mb-2">
                            {sugg.titre || "Annonce sans titre"}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            Ville : {sugg.ville || "—"}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            Superficie : {sugg.superficie || "—"} m²
                          </p>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">
                            <Link to={`/annonces/${sugg.id}`}>Voir détails</Link>
                          </button>
                        </div>
                        {sugg.images && sugg.images.length > 0 && (
                          <img
                            src={`http://localhost:3000${sugg.images[0].url}`}
                            alt={sugg.titre}
                            className="w-24 h-24 object-cover rounded-xl"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>
);

}
