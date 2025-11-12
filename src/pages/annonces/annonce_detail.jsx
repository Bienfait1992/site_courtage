// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function AnnonceDetail() {
//   const { id } = useParams();
//   const [annonce, setAnnonce] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [mainImage, setMainImage] = useState(null); // image principale

//   useEffect(() => {
//     const fetchAnnonce = async () => {
//       try {
//         const res = await fetch(`http://localhost:3000/api/v1/annonces/${id}`);
//         const data = await res.json();
//         setAnnonce(data.annonce);

//         // Définir l'image principale par défaut (la première)
//         if (data.annonce?.images?.length > 0) {
//           setMainImage(`http://localhost:3000${data.annonce.images[0].url}`);
//         }
//       } catch (error) {
//         console.error("Erreur lors du chargement de l'annonce :", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnnonce();
//   }, [id]);

//   if (loading) return <p className="text-center mt-10">Chargement...</p>;
//   if (!annonce) return <p className="text-center mt-10">Annonce non trouvée</p>;

//   return (
//     <div className="container mx-auto p-6 md:px-48">
//       <h1 className="text-3xl font-bold mb-4">{annonce.titre}</h1>
//       <p className="text-gray-700 mb-2">{annonce.description}</p>
//       <p className="text-lg font-semibold text-blue-600 mb-4">{annonce.prix} </p>
//       <p className="text-lg font-semibold text-blue-600 mb-4">{annonce.numero} {annonce.avenue} , {annonce.quartier} , {annonce.commune}  </p>
//       <p className="text-lg font-semibold text-blue-600 mb-4">
//   Téléphone : {annonce.telephone}
// </p>

//       <h3 className="text-xl font-semibold mb-2">Propriétaire</h3>
//       <p>
//         {annonce.owner?.nom} ({annonce.owner?.email})
//       </p>

//       <h3 className="text-xl font-semibold mt-6 mb-3">Images</h3>

//       {/* Image principale */}
//       {mainImage ? (
//         <div className="mb-4">
//           <img
//             src={mainImage}
//             alt="Image principale"
//             className="w-full h-[400px] object-cover rounded-2xl shadow-md transition-all duration-300"
//           />
//         </div>
//       ) : (
//         <p>Aucune image disponible</p>
//       )}

//       {/* Miniatures secondaires */}
//       {annonce.images && annonce.images.length > 1 && (
//         <div className="flex gap-3 flex-wrap justify-start">
//           {annonce.images.map((img, index) => {
//             const url = `http://localhost:3000${img.url}`;
//             return (
//               <div
//                 key={index}
//                 className="relative cursor-pointer group"
//                 onMouseEnter={() => setMainImage(url)} // survol
//                 onClick={() => setMainImage(url)} // ou clic
//               >
//                 <img
//                   src={url}
//                   alt={`Miniature ${index + 1}`}
//                   className={`w-24 h-24 object-cover rounded-lg border-2 transition-all duration-300 ${
//                     mainImage === url
//                       ? "border-blue-500 scale-105"
//                       : "border-gray-300 hover:border-blue-400 hover:scale-105"
//                   }`}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VisiteVirtuelleModal from "./visite_virtuelle";

export default function AnnonceDetail() {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [showVisite, setShowVisite] = useState(false);




  useEffect(() => {
    const fetchAnnonce = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/annonces/${id}`);
        const data = await res.json();
        setAnnonce(data.annonce);

        if (data.annonce?.images?.length > 0) {
          setMainImage(`http://localhost:3000${data.annonce.images[0].url}`);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'annonce :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonce();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (!annonce) return <p className="text-center mt-10">Annonce non trouvée</p>;

  const whatsappNumber = annonce.telephone ? annonce.telephone.replace("+", "") : "";

  const isLocation = annonce.mode?.toLowerCase() === "location";
  const isVente = annonce.mode?.toLowerCase() === "vente";

  return (
    <div className="container mx-auto p-6 md:px-48">
      {/* Titre */}
      <h1 className="text-3xl font-bold mb-4">{annonce.titre}</h1>

      {/* Type et statut */}
      {/* <div className="flex flex-wrap gap-4 text-gray-700 mb-2">
        <span><strong>Type :</strong> {annonce.typeBien}</span>
        <span><strong>Statut :</strong> {annonce.statut}</span>
        <span><strong>Mode :</strong> {annonce.mode}</span>
      </div> */}

      {/* Section images */}
      <div className="flex gap-4 mb-6">
        {/* Image principale */}
        {mainImage ? (
          <div className="flex-shrink-0 w-[70%]">
            <img
              src={mainImage}
              alt="Image principale"
              className="w-full h-[400px] object-cover rounded-2xl shadow-md transition-all duration-300"
            />
          </div>
        ) : (
          <p>Aucune image disponible</p>
        )}

        {/* Miniatures secondaires */}
        {annonce.images && annonce.images.length > 1 && (
          <div className="flex flex-col gap-3">
            {annonce.images.map((img, index) => {
              const url = `http://localhost:3000${img.url}`;
              return (
                <div
                  key={index}
                  className="relative cursor-pointer group w-24 h-24"
                  onMouseEnter={() => setMainImage(url)}
                  onClick={() => setMainImage(url)}
                >
                  <img
                    src={url}
                    alt={`Miniature ${index + 1}`}
                    className={`w-full h-full object-cover rounded-lg border-2 transition-all duration-300 ${
                      mainImage === url
                        ? "border-blue-500 scale-105"
                        : "border-gray-300 hover:border-blue-400 hover:scale-105"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <span className="font-semibold">Description :</span>
        <p className="text-gray-700">{annonce.description}</p>
      </div>

      {/* Prix dynamique selon le mode */}
      
      <p className="text-lg mb-2">
  <span className="font-semibold">
    {isLocation ? "Montant du loyer :" : "Prix de vente :"}{" "}
  </span>
  <span className="text-blue-600 font-bold">
    {isLocation
      ? annonce.loyer
        ? `${annonce.loyer} ${annonce.currency || "USD"}`
        : "Non renseigné"
      : annonce.prix
      ? `${annonce.prix} ${annonce.currency || "USD"}`
      : "Non renseigné"}
  </span>
</p>


      {/* Détails sur la surface */}
      {(annonce.superficie || annonce.surfaceDetail) && (
        <p className="mb-2">
          <span className="font-semibold">Superficie :</span>{" "}
          {annonce.superficie
            ? `${annonce.superficie} m²`
            : annonce.surfaceDetail || "Non précisée"}
        </p>
      )}

      {/* Localisation */}
      <p className="text-gray-800 mb-2">
        <strong>Adresse :</strong>{" "}
        {[
          annonce.numero,
          annonce.avenue,
          annonce.quartier,
          annonce.commune,
          annonce.ville,
        ]
          .filter(Boolean)
          .join(", ")}
      </p>

      {/* Coordonnées GPS */}
      {annonce.latitude && annonce.longitude && (
        <p className="text-gray-700 mb-2">
          <strong>Coordonnées GPS :</strong> {annonce.latitude}, {annonce.longitude}
        </p>
      )}

      {/* Zonage (si présent) */}
      {/* Zonage (si présent) */}
{annonce.details && (annonce.details.zonageSelect || annonce.details.zonageText) && (
  <p className="mb-2">
    <strong>Zonage :</strong>{" "}
    {annonce.details.zonageSelect || annonce.details.zonageText || "Non précisé"}
  </p>
)}


      {/* Autres détails dynamiques */}
      {annonce.details && Object.keys(annonce.details).length > 0 && (
  <div className="mt-4">
    <h3 className="font-semibold mb-2">Autres détails :</h3>
    <ul className="list-disc list-inside text-gray-700">
      {Object.entries(annonce.details).map(([key, value]) => {
        const displayValue =
          typeof value === "boolean" ? (value ? "Oui" : "Non") : value;

        return (
          <li key={key}>
            <strong>{key} :</strong> {displayValue}
          </li>
        );
      })}
    </ul>
  </div>
)}


      {/* Contact propriétaire */}
      <div className="mt-6 flex items-center gap-4">
        <p className="font-semibold">
          Contacter : {annonce.owner?.name || "Propriétaire inconnu"}
        </p>
        {annonce.telephone && (
          <button
            onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            WhatsApp
          </button>
        )}
      </div>
      <div className="">
        <h2>{annonce.title}</h2>

      <div className="pt-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => setShowVisite(true)}
        >
          Demander une visite virtuelle
        </button>

        <VisiteVirtuelleModal
          open={showVisite}
          onClose={() => setShowVisite(false)}
          roomId={`visite-${annonce.id}`}
          userType="client"
        />
      </div>
      </div>


      {/* Dates */}
      <div className="text-gray-500 mt-6 text-sm">
        <p>Créée le : {new Date(annonce.createdAt).toLocaleDateString()}</p>
        <p>Dernière mise à jour : {new Date(annonce.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

