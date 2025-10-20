// import { useState, useRef, useEffect } from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

// export default function CreateAnnonceForm() {
//   const habitationTypes = [
//     "MAISON",
//     "VILLA",
//     "APPARTEMENT",
//     "STUDIO",
//     "IMMEUBLE",
//     "BUREAU",
//     "LOCAL_COMMERCIAL",
//   ];
//   const terrainTypes = ["PARCELLE"];
//   const autreTypes = ["VEHICULE", "HOTEL", "ENTREPOT", "PARKING"];
//   const allTypes = [...habitationTypes, ...terrainTypes, ...autreTypes];

//   const [formData, setFormData] = useState({
//     titre: "",
//     description: "",
//     typeBien: "",
//     prix: "",
//     loyer: "",
//     currency: "USD",
//     superficie: "",
//     surfaceDetail: "",
//     latitude: "",
//     longitude: "",
//     ville: "",
//     quartier: "",
//     avenue: "",
//     numero: "",
//     commune: "",
//     telephone: "",
//     mode: "", // VENTE ou LOCATION
//     zonageText: "",
//     zonageSelect: "",
//   });

//   const [champsSpecifiques, setChampsSpecifiques] = useState({});
//   const [images, setImages] = useState([]);
//   const [previews, setPreviews] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [errors, setErrors] = useState({});
//   const fileInputRef = useRef(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleTypeBienChange = (e) => {
//     const type = e.target.value;
//     setFormData((prev) => ({ ...prev, typeBien: type }));
//     setErrors((prev) => ({ ...prev, typeBien: "" }));

//     switch (type) {
//       case "MAISON":
//       case "VILLA":
//       case "APPARTEMENT":
//       case "STUDIO":
//       case "IMMEUBLE":
//         setChampsSpecifiques({
//           nombreChambres: "",
//           nombreSallesDeBain: "",
//           garage: false,
//         });
//         break;
//       case "VEHICULE":
//         setChampsSpecifiques({
//           marque: "",
//           modele: "",
//           annee: "",
//           kilometrage: "",
//         });
//         break;
//       default:
//         setChampsSpecifiques({});
//     }
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;
//     setImages((prev) => [...prev, ...files]);
//   };

//   useEffect(() => {
//     const urls = images.map((file) => URL.createObjectURL(file));
//     previews.forEach((u) => URL.revokeObjectURL(u));
//     setPreviews(urls);
//     return () => urls.forEach((u) => URL.revokeObjectURL(u));
//   }, [images]);

//   const handleImageRemove = (index) => {
//     setImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const validate = () => {
//     const newErrors = {};
//     const requiredFields = [
//       "titre",
//       "description",
//       "typeBien",
//       "latitude",
//       "longitude",
//       "ville",
//       "commune",
//       "avenue",
//       "numero",
//       "telephone",
//       "mode",
//     ];

//     requiredFields.forEach((f) => {
//       if (!formData[f]) newErrors[f] = "Champ requis";
//     });

//     if (formData.mode === "VENTE" && !formData.prix) {
//       newErrors.prix = "Prix requis pour la vente";
//     }

//     if (formData.mode === "LOCATION" && !formData.loyer) {
//       newErrors.loyer = "Loyer requis pour la location";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setLoading(true);
//     setMessage("");

//     try {
//       const data = new FormData();
//       Object.entries(formData).forEach(([k, v]) => {
//         if (v !== "") data.append(k, v);
//       });

//       // fusion du zonage (select + texte libre)
//       if (formData.zonageText && !formData.zonageSelect) {
//         data.append("zonage", formData.zonageText);
//       } else if (formData.zonageSelect) {
//         data.append("zonage", formData.zonageSelect);
//       }

//       data.append("details", JSON.stringify(champsSpecifiques));
//       images.forEach((file) => data.append("images", file));

//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:3000/api/v1/annonces", {
//         method: "POST",
//         headers: { Authorization: token ? `Bearer ${token}` : "" },
//         body: data,
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message || "Erreur serveur");

//       setMessage("Annonce créée avec succès !");
//       setFormData({
//         titre: "",
//         description: "",
//         typeBien: "",
//         prix: "",
//         loyer: "",
//         currency: "USD",
//         superficie: "",
//         surfaceDetail: "",
//         latitude: "",
//         longitude: "",
//         ville: "",
//         quartier: "",
//         avenue: "",
//         numero: "",
//         commune: "",
//         telephone: "",
//         mode: "",
//         zonageText: "",
//         zonageSelect: "",
//       });
//       setChampsSpecifiques({});
//       setImages([]);
//       setPreviews([]);
//       setErrors({});
//     } catch (err) {
//       setMessage(err.message || "Erreur lors de la création");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputClass = (field) =>
//     `border p-2 rounded-md w-full ${
//       errors[field] ? "border-red-500" : "border-gray-300"
//     }`;

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 mb-16"
//     >
//       <h2 className="text-2xl font-semibold text-center mb-4">
//         Créer une annonce
//       </h2>

//       <div className="space-y-3">
//         <input
//           type="text"
//           name="titre"
//           placeholder="Titre de l'annonce"
//           value={formData.titre}
//           onChange={handleChange}
//           className={inputClass("titre")}
//         />

//         <textarea
//           name="description"
//           placeholder="Description complète"
//           value={formData.description}
//           onChange={handleChange}
//           rows={4}
//           className={inputClass("description")}
//         />

//         <select
//           name="typeBien"
//           value={formData.typeBien}
//           onChange={handleTypeBienChange}
//           className={inputClass("typeBien")}
//         >
//           <option value="">Sélectionnez le type de bien</option>
//           {allTypes.map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>

//         <select
//           name="mode"
//           value={formData.mode}
//           onChange={handleChange}
//           className={inputClass("mode")}
//         >
//           <option value="">Sélectionnez le mode</option>
//           <option value="VENTE">Vente</option>
//           <option value="LOCATION">Location</option>
//         </select>

//         {/* Prix ou Loyer */}
//         {formData.mode === "VENTE" && (
//           <div className="grid grid-cols-2 gap-2">
//             <input
//               type="number"
//               name="prix"
//               placeholder="Prix de vente"
//               value={formData.prix}
//               onChange={handleChange}
//               className={inputClass("prix")}
//             />
//             <select
//               name="currency"
//               value={formData.currency}
//               onChange={handleChange}
//               className="border p-2 rounded-md"
//             >
//               <option value="USD">USD ($)</option>
//               <option value="EUR">EUR (€)</option>
//               <option value="CDF">CDF (FC)</option>
//             </select>
//           </div>
//         )}

//         {formData.mode === "LOCATION" && (
//           <div className="grid grid-cols-2 gap-2">
//             <input
//               type="number"
//               name="loyer"
//               placeholder="Loyer mensuel"
//               value={formData.loyer}
//               onChange={handleChange}
//               className={inputClass("loyer")}
//             />
//             <select
//               name="currency"
//               value={formData.currency}
//               onChange={handleChange}
//               className="border p-2 rounded-md"
//             >
//               <option value="USD">USD ($)</option>
//               <option value="EUR">EUR (€)</option>
//               <option value="CDF">CDF (FC)</option>
//             </select>
//           </div>
//         )}

//         {/* Superficie et dimensions */}
//         {(habitationTypes.includes(formData.typeBien) ||
//           terrainTypes.includes(formData.typeBien)) && (
//           <div className="grid grid-cols-2 gap-2">
//             <input
//               type="number"
//               name="superficie"
//               placeholder="Superficie (m²)"
//               value={formData.superficie}
//               onChange={handleChange}
//               className={inputClass("superficie")}
//             />
//             <input
//               type="text"
//               name="surfaceDetail"
//               placeholder="Dimensions (ex: 20x10x30x15)"
//               value={formData.surfaceDetail}
//               onChange={handleChange}
//               className={inputClass("surfaceDetail")}
//             />
//           </div>
//         )}

//         {/* Zonage */}
//         {formData.typeBien === "PARCELLE" && (
//           <div className="grid grid-cols-2 gap-2">
//             <select
//               name="zonageSelect"
//               value={formData.zonageSelect}
//               onChange={handleChange}
//               className="border p-2 rounded-md"
//             >
//               <option value="">Sélectionnez le zonage</option>
//               <option value="Résidentiel">Résidentiel</option>
//               <option value="Commercial">Commercial</option>
//               <option value="Industriel">Industriel</option>
//               <option value="Mixte">Mixte</option>
//               <option value="Autre">Autre</option>
//             </select>

//             {formData.zonageSelect === "Autre" && (
//               <input
//                 type="text"
//                 name="zonageText"
//                 placeholder="Autre type de zonage"
//                 value={formData.zonageText}
//                 onChange={handleChange}
//                 className="border p-2 rounded-md"
//               />
//             )}
//           </div>
//         )}

//         {/* Coordonnées */}
//         <div className="grid grid-cols-2 gap-2">
//           <input
//             type="number"
//             name="longitude"
//             placeholder="Longitude"
//             value={formData.longitude}
//             onChange={handleChange}
//             className={inputClass("longitude")}
//           />
//           <input
//             type="number"
//             name="latitude"
//             placeholder="Latitude"
//             value={formData.latitude}
//             onChange={handleChange}
//             className={inputClass("latitude")}
//           />
//         </div>

//         <div className="grid grid-cols-3 gap-2">
//           <input
//             type="text"
//             name="ville"
//             placeholder="Ville"
//             value={formData.ville}
//             onChange={handleChange}
//             className={inputClass("ville")}
//           />
//           <input
//             type="text"
//             name="quartier"
//             placeholder="Quartier"
//             value={formData.quartier}
//             onChange={handleChange}
//             className={inputClass("quartier")}
//           />
//           <input
//             type="text"
//             name="avenue"
//             placeholder="Avenue"
//             value={formData.avenue}
//             onChange={handleChange}
//             className={inputClass("avenue")}
//           />
//         </div>

//         <input
//           type="text"
//           name="commune"
//           placeholder="Commune"
//           value={formData.commune}
//           onChange={handleChange}
//           className={inputClass("commune")}
//         />

//         <div className="grid grid-cols-2 gap-2">
//           <PhoneInput
//             country="cd"
//             value={formData.telephone}
//             onChange={(phone) =>
//               setFormData((prev) => ({ ...prev, telephone: phone }))
//             }
//             inputClass={
//               errors.telephone
//                 ? "border-red-500 p-2 rounded-md w-full"
//                 : "border p-2 rounded-md w-full"
//             }
//           />
//           <input
//             type="text"
//             name="numero"
//             placeholder="Numéro de l'adresse"
//             value={formData.numero}
//             onChange={handleChange}
//             className={inputClass("numero")}
//           />
//         </div>

//         {/* Champs dynamiques */}
//         {Object.keys(champsSpecifiques).length > 0 && (
//           <div className="space-y-2">
//             {Object.entries(champsSpecifiques).map(([key, value]) =>
//               typeof value === "boolean" ? (
//                 <label key={key} className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     checked={value}
//                     onChange={(e) =>
//                       setChampsSpecifiques((prev) => ({
//                         ...prev,
//                         [key]: e.target.checked,
//                       }))
//                     }
//                   />
//                   {key}
//                 </label>
//               ) : (
//                 <input
//                   key={key}
//                   type={
//                     ["annee", "kilometrage"].includes(key) ? "number" : "text"
//                   }
//                   name={key}
//                   placeholder={key}
//                   value={value}
//                   onChange={(e) =>
//                     setChampsSpecifiques((prev) => ({
//                       ...prev,
//                       [key]: e.target.value,
//                     }))
//                   }
//                   className={inputClass(key)}
//                 />
//               )
//             )}
//           </div>
//         )}

//         {/* Images */}
//         <div>
//           <input
//             ref={fileInputRef}
//             type="file"
//             name="images"
//             multiple
//             accept="image/*"
//             onChange={handleImageChange}
//             className="hidden"
//           />
//           <div className="flex gap-2">
//             <button
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
//             >
//               Sélectionner des images
//             </button>
//             <div className="flex-1 text-sm text-gray-600 self-center">
//               {images.length > 0
//                 ? `${images.length} image(s) sélectionnée(s)`
//                 : "Aucune image"}
//             </div>
//           </div>

//           {previews.length > 0 && (
//             <div className="flex gap-3 mt-3 flex-wrap">
//               {previews.map((url, i) => (
//                 <div key={i} className="relative">
//                   <img
//                     src={url}
//                     alt={`preview-${i}`}
//                     className="w-28 h-28 object-cover rounded-md border"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleImageRemove(i)}
//                     className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md mt-4"
//         >
//           {loading ? "Création..." : "Créer l'annonce"}
//         </button>

//         {message && <p className="mt-3 text-center text-sm">{message}</p>}
//       </div>
//     </form>
//   );
// }




import { useState, useRef, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function CreateAnnonceForm() {
  const habitationTypes = [
    "MAISON",
    "VILLA",
    "APPARTEMENT",
    "STUDIO",
    "IMMEUBLE",
    "BUREAU",
    "LOCAL_COMMERCIAL",
  ];
  const terrainTypes = ["PARCELLE"];
  const autreTypes = ["VEHICULE", "HOTEL", "ENTREPOT", "PARKING"];
  const allTypes = [...habitationTypes, ...terrainTypes, ...autreTypes];

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    typeBien: "",
    prix: "",
    loyer: "",
    currency: "USD",
    superficie: "",
    surfaceDetail: "",
    latitude: "",
    longitude: "",
    ville: "",
    quartier: "",
    avenue: "",
    numero: "",
    commune: "",
    telephone: "",
    mode: "", // VENTE ou LOCATION
    zonageText: "",
    zonageSelect: "",
    // hôtel : mode de gestion (ENTIER = hôtel entier, PAR_CHAMBRE = par chambre)
    hotelGestion: "ENTIER",
  });

  const [champsSpecifiques, setChampsSpecifiques] = useState({});
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Gestion des champs de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Gestion type de bien
  const handleTypeBienChange = (e) => {
    const type = e.target.value;
    setFormData((prev) => ({ ...prev, typeBien: type }));
    setErrors((prev) => ({ ...prev, typeBien: "" }));

    switch (type) {
      case "MAISON":
      case "VILLA":
      case "APPARTEMENT":
      case "STUDIO":
      case "IMMEUBLE":
        setChampsSpecifiques({
          nombreChambres: "",
          nombreSallesDeBain: "",
          garage: false,
        });
        break;
      case "VEHICULE":
        setChampsSpecifiques({
          marque: "",
          modele: "",
          annee: "",
          kilometrage: "",
        });
        break;
      case "HOTEL":
        // initialiser structure chambres si pas déjà
        setChampsSpecifiques({
          nombreChambres: 0,
          chambres:
            champsSpecifiques.chambres && champsSpecifiques.chambres.length > 0
              ? champsSpecifiques.chambres
              : [],
        });
        break;
      default:
        setChampsSpecifiques({});
    }
  };

  // Gestion images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImages((prev) => [...prev, ...files]);
  };

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    previews.forEach((u) => URL.revokeObjectURL(u));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  const handleImageRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "titre",
      "description",
      "typeBien",
      "latitude",
      "longitude",
      "ville",
      "commune",
      "avenue",
      "numero",
      "telephone",
      "mode",
    ];

    requiredFields.forEach((f) => {
      if (!formData[f]) newErrors[f] = "Champ requis";
    });

    // si hôtel:
    if (formData.typeBien === "HOTEL") {
      if (formData.hotelGestion === "ENTIER") {
        // hôtel entier : exiger prix/loyer global selon mode
        if (formData.mode === "VENTE" && !formData.prix) {
          newErrors.prix = "Prix requis pour la vente de l'hôtel";
        }
        if (formData.mode === "LOCATION" && !formData.loyer) {
          newErrors.loyer = "Loyer requis pour la location de l'hôtel";
        }
      } else if (formData.hotelGestion === "PAR_CHAMBRE") {
        // par chambre : doit y avoir au moins une chambre et chaque chambre validée
        const chambres = champsSpecifiques.chambres || [];
        if (!chambres.length) {
          newErrors.chambres = "Ajoutez au moins une chambre";
        } else {
          chambres.forEach((c, i) => {
            if (!c.numero || !c.standing) {
              newErrors[`chambre-${i}`] = "Chaque chambre doit avoir un numéro et un standing";
            }
            if (formData.mode === "VENTE" && (c.prix === undefined || c.prix === null || c.prix === "")) {
              newErrors[`chambre-prix-${i}`] = "Prix requis pour cette chambre";
            }
            if (formData.mode === "LOCATION" && (c.loyer === undefined || c.loyer === null || c.loyer === "")) {
              newErrors[`chambre-loyer-${i}`] = "Loyer requis pour cette chambre";
            }
            // currency par chambre est optionnelle — si fournie ok
          });
        }
      }
    } else {
      // non-hôtel : comportement global classique
      if (formData.mode === "VENTE" && !formData.prix) {
        newErrors.prix = "Prix requis pour la vente";
      }
      if (formData.mode === "LOCATION" && !formData.loyer) {
        newErrors.loyer = "Loyer requis pour la location";
      }
    }

    // validation des champsSpecifiques non-hôtel
    if (formData.typeBien !== "HOTEL") {
      Object.keys(champsSpecifiques || {}).forEach((key) => {
        const val = champsSpecifiques[key];
        if ((val === "" || val == null) && typeof val !== "boolean") {
          // ne pas exiger si champ absent de l'UI — ici on garde la logique conservatrice
          // mais pour éviter erreurs si champsSpecifiques vide, on vérifie seulement si existe
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        // n'ajoute pas hotelGestion si vide — mais on veut l'envoyer
        if (v !== "") data.append(k, v);
      });

      // fusion du zonage (select + texte libre)
      if (formData.zonageText && !formData.zonageSelect) {
        data.append("zonage", formData.zonageText);
      } else if (formData.zonageSelect) {
        data.append("zonage", formData.zonageSelect);
      }

      // ajouter la logique hôtel :
      // si hôtel et gestion par chambre, on met chambres dans details.chambres
      const detailsToSend = { ...(champsSpecifiques || {}) };
      if (formData.typeBien === "HOTEL") {
        detailsToSend.hotelGestion = formData.hotelGestion;
        // si ENTIER on peut transmettre prix/loyer global (déjà dans formData)
        // si PAR_CHAMBRE on envoie les chambres
        if (formData.hotelGestion === "PAR_CHAMBRE") {
          detailsToSend.chambres = champsSpecifiques.chambres || [];
        }
      }

      data.append("details", JSON.stringify(detailsToSend));

      images.forEach((file) => data.append("images", file));

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/v1/annonces", {
        method: "POST",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
        body: data,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Erreur serveur");

      setMessage("Annonce créée avec succès !");
      // reset : conserver la shape initiale exactement comme demandé
      setFormData({
        titre: "",
        description: "",
        typeBien: "",
        prix: "",
        loyer: "",
        currency: "USD",
        superficie: "",
        surfaceDetail: "",
        latitude: "",
        longitude: "",
        ville: "",
        quartier: "",
        avenue: "",
        numero: "",
        commune: "",
        telephone: "",
        mode: "",
        zonageText: "",
        zonageSelect: "",
        hotelGestion: "ENTIER",
      });
      setChampsSpecifiques({});
      setImages([]);
      setPreviews([]);
      setErrors({});
    } catch (err) {
      setMessage(err.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `border p-2 rounded-md w-full ${errors[field] ? "border-red-500" : "border-gray-300"}`;

  // helpers hotel : ajouter / supprimer chambre
  const addHotelChambre = () => {
    setChampsSpecifiques((prev) => {
      const existing = prev.chambres ? [...prev.chambres] : [];
      existing.push({ numero: "", standing: "", prix: "", loyer: "", currency: formData.currency || "USD" });
      return { ...prev, chambres: existing, nombreChambres: existing.length };
    });
  };
  const removeHotelChambre = (index) => {
    setChampsSpecifiques((prev) => {
      const existing = prev.chambres ? prev.chambres.filter((_, i) => i !== index) : [];
      return { ...prev, chambres: existing, nombreChambres: existing.length };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 mb-16">
      <h2 className="text-2xl font-semibold text-center mb-4">Créer une annonce</h2>

      <div className="space-y-3">
        <input type="text" name="titre" placeholder="Titre de l'annonce" value={formData.titre} onChange={handleChange} className={inputClass("titre")} />

        <textarea name="description" placeholder="Description complète" value={formData.description} onChange={handleChange} rows={4} className={inputClass("description")} />

        <select name="typeBien" value={formData.typeBien} onChange={handleTypeBienChange} className={inputClass("typeBien")}>
          <option value="">Sélectionnez le type de bien</option>
          {allTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select name="mode" value={formData.mode} onChange={handleChange} className={inputClass("mode")}>
          <option value="">Sélectionnez le mode</option>
          <option value="VENTE">Vente</option>
          <option value="LOCATION">Location</option>
        </select>

        {/* Si hôtel sélectionné : sélecteur de gestion (ENTIER vs PAR_CHAMBRE) */}
        {formData.typeBien === "HOTEL" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
            <label className="flex items-center gap-2">
              <span className="whitespace-nowrap">Mode gestion :</span>
              <select name="hotelGestion" value={formData.hotelGestion} onChange={(e) => setFormData((prev) => ({ ...prev, hotelGestion: e.target.value }))} className="border p-2 rounded-md">
                <option value="ENTIER">Hôtel entier</option>
                <option value="PAR_CHAMBRE">Par chambre</option>
              </select>
            </label>

            {/* montrer currency global aussi (toujours visible pour hôtel entier) */}
            <div>
              <label className="text-sm text-gray-600">Devise par défaut :</label>
              <select name="currency" value={formData.currency} onChange={handleChange} className="border p-2 rounded-md w-full">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="CDF">CDF (FC)</option>
              </select>
            </div>
          </div>
        )}

        {/* Prix / Loyer global pour tout sauf HOTEL-PAR_CHAMBRE */}
        {!(formData.typeBien === "HOTEL" && formData.hotelGestion === "PAR_CHAMBRE") && (
          <div className="grid grid-cols-2 gap-2">
            {/* placeholder explicite différent pour vente/location */}
            <input
              type="number"
              name={formData.mode === "VENTE" ? "prix" : "loyer"}
              placeholder={formData.mode === "VENTE" ? "Prix de vente" : formData.mode === "LOCATION" ? "Loyer mensuel" : "Montant (vente/location)"}
              value={formData.mode === "VENTE" ? formData.prix : formData.loyer}
              onChange={handleChange}
              className={inputClass(formData.mode === "VENTE" ? "prix" : "loyer")}
            />
            <select name="currency" value={formData.currency} onChange={handleChange} className="border p-2 rounded-md">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="CDF">CDF (FC)</option>
            </select>
          </div>
        )}

        {/* Si hôtel et gestion PAR_CHAMBRE --> afficher la gestion par chambre */}
        {formData.typeBien === "HOTEL" && formData.hotelGestion === "PAR_CHAMBRE" && (
          <div className="mt-4 space-y-3">
            <h3 className="font-semibold">Chambres (par chambre)</h3>

            {/* message d'erreur si aucune chambre */}
            {errors.chambres && <div className="text-red-500 text-sm">{errors.chambres}</div>}

            {(champsSpecifiques.chambres || []).map((c, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Numéro"
                  value={c.numero}
                  onChange={(e) => {
                    const newChambres = [...(champsSpecifiques.chambres || [])];
                    newChambres[i] = { ...newChambres[i], numero: e.target.value };
                    setChampsSpecifiques((prev) => ({ ...prev, chambres: newChambres, nombreChambres: newChambres.length }));
                  }}
                  className="border p-2 rounded-md"
                />

                <select
                  value={c.standing}
                  onChange={(e) => {
                    const newChambres = [...(champsSpecifiques.chambres || [])];
                    newChambres[i] = { ...newChambres[i], standing: e.target.value };
                    setChampsSpecifiques((prev) => ({ ...prev, chambres: newChambres }));
                  }}
                  className="border p-2 rounded-md"
                >
                  <option value="">Standing</option>
                  <option value="Standard">Standard</option>
                  <option value="Confort">Confort</option>
                  <option value="Suite">Suite</option>
                </select>

                <input
                  type="number"
                  placeholder={formData.mode === "VENTE" ? "Prix chambre" : "Loyer chambre"}
                  value={formData.mode === "VENTE" ? c.prix : c.loyer}
                  onChange={(e) => {
                    const newChambres = [...(champsSpecifiques.chambres || [])];
                    const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                    if (formData.mode === "VENTE") newChambres[i] = { ...newChambres[i], prix: val };
                    else newChambres[i] = { ...newChambres[i], loyer: val };
                    setChampsSpecifiques((prev) => ({ ...prev, chambres: newChambres }));
                  }}
                  className="border p-2 rounded-md"
                />

                <div className="flex gap-2 items-center">
                  <select
                    value={c.currency || formData.currency || "USD"}
                    onChange={(e) => {
                      const newChambres = [...(champsSpecifiques.chambres || [])];
                      newChambres[i] = { ...newChambres[i], currency: e.target.value };
                      setChampsSpecifiques((prev) => ({ ...prev, chambres: newChambres }));
                    }}
                    className="border p-2 rounded-md"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="CDF">CDF</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeHotelChambre(i)}
                    className="ml-1 text-sm text-red-600"
                    title="Supprimer cette chambre"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <div>
              <button type="button" onClick={addHotelChambre} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md">
                Ajouter une chambre
              </button>
            </div>
            {/* afficher erreurs par chambre */}
            {Object.keys(errors || {}).filter((k) => k.startsWith("chambre-") || k.startsWith("chambre-prix-") || k.startsWith("chambre-loyer-")).map((errKey) => (
              <div key={errKey} className="text-red-500 text-sm">{errors[errKey]}</div>
            ))}
          </div>
        )}

        {/* Superficie / surfaceDetail (inchangé) */}
        {(habitationTypes.includes(formData.typeBien) || terrainTypes.includes(formData.typeBien)) && (
          <div className="grid grid-cols-2 gap-2">
            <input type="number" name="superficie" placeholder="Superficie (m²)" value={formData.superficie} onChange={handleChange} className={inputClass("superficie")} />
            <input type="text" name="surfaceDetail" placeholder="Dimensions (ex: 20x10x30x15)" value={formData.surfaceDetail} onChange={handleChange} className={inputClass("surfaceDetail")} />
          </div>
        )}

        {/* Zonage (PARCELLE) */}
        {formData.typeBien === "PARCELLE" && (
          <div className="grid grid-cols-2 gap-2">
            <select name="zonageSelect" value={formData.zonageSelect} onChange={handleChange} className="border p-2 rounded-md">
              <option value="">Sélectionnez le zonage</option>
              <option value="Résidentiel">Résidentiel</option>
              <option value="Commercial">Commercial</option>
              <option value="Industriel">Industriel</option>
              <option value="Mixte">Mixte</option>
              <option value="Autre">Autre</option>
            </select>

            {formData.zonageSelect === "Autre" ? (
              <input type="text" name="zonageText" placeholder="Autre type de zonage" value={formData.zonageText} onChange={handleChange} className="border p-2 rounded-md" />
            ) : (
              <input type="text" name="zonageText" placeholder="Ou décrivez le zonage si autre" value={formData.zonageText} onChange={handleChange} className="border p-2 rounded-md" />
            )}
          </div>
        )}

        {/* Coordonnées */}
        <div className="grid grid-cols-2 gap-2">
          <input type="number" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} className={inputClass("longitude")} />
          <input type="number" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} className={inputClass("latitude")} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input type="text" name="ville" placeholder="Ville" value={formData.ville} onChange={handleChange} className={inputClass("ville")} />
          <input type="text" name="quartier" placeholder="Quartier" value={formData.quartier} onChange={handleChange} className={inputClass("quartier")} />
          <input type="text" name="avenue" placeholder="Avenue" value={formData.avenue} onChange={handleChange} className={inputClass("avenue")} />
        </div>

        <input type="text" name="commune" placeholder="Commune" value={formData.commune} onChange={handleChange} className={inputClass("commune")} />

        <div className="grid grid-cols-2 gap-2">
          <PhoneInput country="cd" value={formData.telephone} onChange={(phone) => setFormData((prev) => ({ ...prev, telephone: phone }))} inputClass={errors.telephone ? "border-red-500 p-2 rounded-md w-full" : "border p-2 rounded-md w-full"} />
          <input type="text" name="numero" placeholder="Numéro de l'adresse" value={formData.numero} onChange={handleChange} className={inputClass("numero")} />
        </div>

        {/* Champs dynamiques non-hôtel */}
        {Object.keys(champsSpecifiques).length > 0 && formData.typeBien !== "HOTEL" && (
          <div className="space-y-2">
            {Object.entries(champsSpecifiques).map(([key, value]) =>
              typeof value === "boolean" ? (
                <label key={key} className="flex items-center gap-2">
                  <input type="checkbox" checked={value} onChange={(e) => setChampsSpecifiques((prev) => ({ ...prev, [key]: e.target.checked }))} />
                  {key}
                </label>
              ) : (
                <input key={key} type={["annee", "kilometrage"].includes(key) ? "number" : "text"} name={key} placeholder={key} value={value} onChange={(e) => setChampsSpecifiques((prev) => ({ ...prev, [key]: e.target.value }))} className={inputClass(key)} />
              )
            )}
          </div>
        )}

        {/* Images */}
        <div>
          <input ref={fileInputRef} type="file" name="images" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          <div className="flex gap-2">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition">Sélectionner des images</button>
            <div className="flex-1 text-sm text-gray-600 self-center">
              {images.length > 0 ? `${images.length} image(s) sélectionnée(s)` : "Aucune image"}
            </div>
          </div>

          {previews.length > 0 && (
            <div className="flex gap-3 mt-3 flex-wrap">
              {previews.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt={`preview-${i}`} className="w-28 h-28 object-cover rounded-md border" />
                  <button type="button" onClick={() => handleImageRemove(i)} className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md mt-4">
          {loading ? "Création..." : "Créer l'annonce"}
        </button>

        {message && <p className="mt-3 text-center text-sm">{message}</p>}
      </div>
    </form>
  );
}
