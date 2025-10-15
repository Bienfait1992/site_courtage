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
        setChampsSpecifiques({
          nombreChambres: 0,
          chambres: [], // pour gérer chaque chambre individuellement
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

    if (formData.mode === "VENTE" && !formData.prix) {
      newErrors.prix = "Prix requis pour la vente";
    }
    if (formData.mode === "LOCATION" && !formData.loyer) {
      newErrors.loyer = "Loyer requis pour la location";
    }

    // Validation chambres hôtel
    if (formData.typeBien === "HOTEL") {
      champsSpecifiques.chambres.forEach((c, i) => {
        if (!c.numero || !c.standing || (!c.prix && formData.mode === "VENTE") || (!c.loyer && formData.mode === "LOCATION")) {
          newErrors[`chambre-${i}`] = "Chaque chambre doit avoir numéro, standing et prix/loyer";
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
        if (v !== "") data.append(k, v);
      });

      if (formData.zonageText && !formData.zonageSelect) {
        data.append("zonage", formData.zonageText);
      } else if (formData.zonageSelect) {
        data.append("zonage", formData.zonageSelect);
      }

      data.append("details", JSON.stringify(champsSpecifiques));
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
    `border p-2 rounded-md w-full ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 mb-16"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">Créer une annonce</h2>

      <div className="space-y-3">
        <input
          type="text"
          name="titre"
          placeholder="Titre de l'annonce"
          value={formData.titre}
          onChange={handleChange}
          className={inputClass("titre")}
        />

        <textarea
          name="description"
          placeholder="Description complète"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={inputClass("description")}
        />

        <select
          name="typeBien"
          value={formData.typeBien}
          onChange={handleTypeBienChange}
          className={inputClass("typeBien")}
        >
          <option value="">Sélectionnez le type de bien</option>
          {allTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          name="mode"
          value={formData.mode}
          onChange={handleChange}
          className={inputClass("mode")}
        >
          <option value="">Sélectionnez le mode</option>
          <option value="VENTE">Vente</option>
          <option value="LOCATION">Location</option>
        </select>

        {/* Prix ou Loyer pour l'ensemble */}
        {formData.mode === "VENTE" && formData.typeBien !== "HOTEL" && (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="prix"
              placeholder="Prix de vente"
              value={formData.prix}
              onChange={handleChange}
              className={inputClass("prix")}
            />
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="border p-2 rounded-md"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="CDF">CDF (FC)</option>
            </select>
          </div>
        )}

        {formData.mode === "LOCATION" && formData.typeBien !== "HOTEL" && (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="loyer"
              placeholder="Loyer mensuel"
              value={formData.loyer}
              onChange={handleChange}
              className={inputClass("loyer")}
            />
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="border p-2 rounded-md"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="CDF">CDF (FC)</option>
            </select>
          </div>
        )}

        {/* Champs dynamiques */}
        {Object.keys(champsSpecifiques).length > 0 &&
          formData.typeBien !== "HOTEL" && (
            <div className="space-y-2">
              {Object.entries(champsSpecifiques).map(([key, value]) =>
                typeof value === "boolean" ? (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setChampsSpecifiques((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                    />
                    {key}
                  </label>
                ) : (
                  <input
                    key={key}
                    type={["annee", "kilometrage"].includes(key) ? "number" : "text"}
                    name={key}
                    placeholder={key}
                    value={value}
                    onChange={(e) =>
                      setChampsSpecifiques((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className={inputClass(key)}
                  />
                )
              )}
            </div>
          )}

        {/* Champs spécifiques Hôtel : chambres */}
        {formData.typeBien === "HOTEL" && champsSpecifiques.chambres && (
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold">Chambres de l'hôtel</h3>
            {champsSpecifiques.chambres.map((c, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Numéro"
                  value={c.numero}
                  onChange={(e) => {
                    const newChambres = [...champsSpecifiques.chambres];
                    newChambres[i].numero = e.target.value;
                    setChampsSpecifiques((prev) => ({ ...prev, chambres: newChambres }));
                  }}
                  className="border p-2 rounded-md"
                />

                <select
                  value={c.standing}
                  onChange={(e) => {
                    const newChambres = [...champsSpecifiques.chambres];
                    newChambres[i].standing = e.target.value;
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
                  placeholder={formData.mode === "VENTE" ? "Prix" : "Loyer"}
                  value={formData.mode === "VENTE" ? c.prix : c.loyer}
                  onChange={(e) => {
                    const newChambres = [...champsSpecifiques.chambres];
                    if (formData.mode === "VENTE") {
                      newChambres[i].prix = parseFloat(e.target.value);
                    } else {
                      newChambres[i].loyer = parseFloat(e.target.value);
                    }
                    setChampsSpecifiques((prev) => ({ ...prev, chambres: newChambres }));
                  }}
                  className="border p-2 rounded-md"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setChampsSpecifiques((prev) => ({
                  ...prev,
                  chambres: [...prev.chambres, { numero: "", standing: "", prix: 0, loyer: 0 }],
                }))
              }
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Ajouter une chambre
            </button>
          </div>
        )}

        {/* Coordonnées et images */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <input
            type="number"
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={handleChange}
            className={inputClass("longitude")}
          />
          <input
            type="number"
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={handleChange}
            className={inputClass("latitude")}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            name="ville"
            placeholder="Ville"
            value={formData.ville}
            onChange={handleChange}
            className={inputClass("ville")}
          />
          <input
            type="text"
            name="quartier"
            placeholder="Quartier"
            value={formData.quartier}
            onChange={handleChange}
            className={inputClass("quartier")}
          />
          <input
            type="text"
            name="avenue"
            placeholder="Avenue"
            value={formData.avenue}
            onChange={handleChange}
            className={inputClass("avenue")}
          />
        </div>

        <input
          type="text"
          name="commune"
          placeholder="Commune"
          value={formData.commune}
          onChange={handleChange}
          className={inputClass("commune")}
        />

        <div className="grid grid-cols-2 gap-2">
          <PhoneInput
            country="cd"
            value={formData.telephone}
            onChange={(phone) =>
              setFormData((prev) => ({ ...prev, telephone: phone }))
            }
            inputClass={
              errors.telephone
                ? "border-red-500 p-2 rounded-md w-full"
                : "border p-2 rounded-md w-full"
            }
          />
          <input
            type="text"
            name="numero"
            placeholder="Numéro de l'adresse"
            value={formData.numero}
            onChange={handleChange}
            className={inputClass("numero")}
          />
        </div>

        {/* Images */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
            >
              Sélectionner des images
            </button>
            <div className="flex-1 text-sm text-gray-600 self-center">
              {images.length > 0
                ? `${images.length} image(s) sélectionnée(s)`
                : "Aucune image"}
            </div>
          </div>

          {previews.length > 0 && (
            <div className="flex gap-3 mt-3 flex-wrap">
              {previews.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    alt={`preview-${i}`}
                    className="w-28 h-28 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(i)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md mt-4"
        >
          {loading ? "Création..." : "Créer l'annonce"}
        </button>

        {message && <p className="mt-3 text-center text-sm">{message}</p>}
      </div>
    </form>
  );
}
