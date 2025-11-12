import { useState } from "react";
import { useAuthStore } from "../../provider/useAuthStore";

export default function SouscriptionAnnonce() {
  const habitationTypes = ["MAISON","VILLA","APPARTEMENT","STUDIO","IMMEUBLE","BUREAU","LOCAL_COMMERCIAL"];
  const terrainTypes   = ["PARCELLE"];
  const autreTypes     = ["VEHICULE","HOTEL","ENTREPOT","PARKING"];
  const allTypes       = [...habitationTypes, ...terrainTypes, ...autreTypes];

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const authStore = useAuthStore();


  const [formData, setFormData] = useState({
    typeBien: "",
    mode: "",
    prixMin: "", prixMax: "",
    loyerMin: "", loyerMax: "",
    ville: "", quartier: "", commune: "",
    superficieMin: "", superficieMax: "",
    zonageSelect: "", zonageText: "",
    currency: "USD",
    latitude: "", longitude: ""
  });

  const [champsSpecifiques, setChampsSpecifiques] = useState({});
  const [loading, setLoading] = useState(false);

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeBienChange = (e) => {
    const type = e.target.value;
    setFormData(prev => ({ ...prev, typeBien: type }));

    switch(type) {
      case "MAISON":
      case "VILLA":
      case "APPARTEMENT":
      case "STUDIO":
      case "IMMEUBLE":
        setChampsSpecifiques({ nombreChambres:"", nombreSallesDeBain:"", garage:false });
        break;
      case "VEHICULE":
        setChampsSpecifiques({ marque:"", modele:"", annee:"", kilometrage:"" });
        break;
      case "HOTEL":
        setChampsSpecifiques({ hotelGestion:"ENTIER", chambres:[] });
        break;
      default:
        setChampsSpecifiques({});
    }
  };

  const addHotelChambre = () => {
    setChampsSpecifiques(prev => {
      const existing = prev.chambres ? [...prev.chambres] : [];
      existing.push({ numero:"", standing:"", prix:"", loyer:"", currency: formData.currency });
      return { ...prev, chambres: existing };
    });
  };

  const removeHotelChambre = (index) => {
    setChampsSpecifiques(prev => {
      const existing = prev.chambres ? prev.chambres.filter((_,i)=>i!==index) : [];
      return { ...prev, chambres: existing };
    });
  };

   const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["typeBien", "mode", "ville", "currency"];

    requiredFields.forEach((field) => {
      if (!formData[field] || !formData[field].trim()) {
        newErrors[field] = "Ce champ est obligatoire.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔹 Enregistrement des critères de souscription
 const handleSouscription = async () => {
  setLoading(true);

   if (!validateForm()) {
      setMessage("Merci de remplir tous les champs obligatoires.");
      return;
    }

  try {
    const token = authStore.token;
    if (!token) {
      alert("Vous devez être connecté pour souscrire.");
      setLoading(false);
      return;
    }

    // Préparer les données à envoyer
    const payload = {
      ...formData,
      detailsFilters: champsSpecifiques,
    };

    const response = await fetch("http://localhost:3000/api/v1/souscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      // alert("Souscription enregistrée avec succès !");
      setMessage("Souscription enregistrée avec succès !");
      // Optionnel : reset formulaire
      setFormData({
        typeBien: "",
        mode: "",
        prixMin: "", prixMax: "",
        loyerMin: "", loyerMax: "",
        ville: "", quartier: "", commune: "",
        superficieMin: "", superficieMax: "",
        zonageSelect: "", zonageText: "",
        currency: "USD",
        latitude: "", longitude: ""
      });
      setChampsSpecifiques({});
    } else {
      // alert("Erreur : " + (result.message || "Erreur serveur"));
            setMessage("Une erreur est survenue. Veuillez réessayer.");

    }

  } catch (err) {
    console.error("Erreur souscription :", err);
    alert("Erreur réseau ou serveur");
  } finally {
    setLoading(false);
  }
};

  const inputClass = "border p-2 rounded-md w-full";
   const renderLabel = (name, label, required = false) => (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 mb-16">
//       <h2 className="text-3xl font-semibold text-center mb-6">Souscrire aux annonces</h2>

//        <p className="text-sm text-gray-500 mb-6">
//         Les champs marqués d’un <span className="text-red-500">*</span> sont
//         obligatoires.
//       </p>

//        {message && (
//         <div
//           className={`p-3 rounded-lg mb-4 ${
//             message.startsWith("✅")
//               ? "bg-green-100 text-green-700"
//               : "bg-yellow-100 text-yellow-700"
//           }`}
//         >
//           {message}
//         </div>
//       )}

//       {/* Formulaire */}
//       <div className="space-y-4">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           {/* {renderLabel("typeBien", "Type de bien", true)} */}
//           <select name="typeBien" value={formData.typeBien} onChange={handleTypeBienChange} className={inputClass}>
//             <option value="">Type de bien</option>
//             {allTypes.map(type => <option key={type} value={type}>{type}</option>)}
//           </select>
//           {errors.typeBien && <p className="text-red-500 text-xs">{errors.typeBien}</p>}
//  {renderLabel("mode", "Mode", true)}
//           <select name="mode" value={formData.mode} onChange={handleChange} className={inputClass}>
//             <option value="">Mode</option>
//             <option value="VENTE">Vente</option>
//             <option value="LOCATION">Location</option>
//           </select>
//           {errors.mode && <p className="text-red-500 text-xs">{errors.mode}</p>}
//         </div>
// <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//   {formData.mode === "VENTE" && (
//     <>
//       <input type="number" name="prixMin" placeholder="Prix min" value={formData.prixMin} onChange={handleChange} className={inputClass} />
//       <input type="number" name="prixMax" placeholder="Prix max" value={formData.prixMax} onChange={handleChange} className={inputClass} />
//     </>
//   )}
//   {formData.mode === "LOCATION" && (
//     <>
//       <input type="number" name="loyerMin" placeholder="Loyer min" value={formData.loyerMin} onChange={handleChange} className={inputClass} />
//       <input type="number" name="loyerMax" placeholder="Loyer max" value={formData.loyerMax} onChange={handleChange} className={inputClass} />
//     </>
//   )}
// </div>
// <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//    {renderLabel("currency", "Devise", true)}
//   <select
//     name="currency"
//     value={formData.currency}
//     onChange={handleChange}
//     className={inputClass}
//   >
//     <option value="USD">USD ($)</option>
//     <option value="CDF">CDF (Franc Congolais)</option>
//     <option value="EUR">EUR (€)</option>
//   </select>
//   {errors.currency && (
//             <p className="text-red-500 text-xs">{errors.currency}</p>
//           )}
// </div>



//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//            {renderLabel("ville", "Ville", true)}
//           <input type="text" name="ville" placeholder="Ville" value={formData.ville} onChange={handleChange} className={inputClass} />
//           {errors.ville && <p className="text-red-500 text-xs">{errors.ville}</p>}
//           <input type="text" name="quartier" placeholder="Quartier" value={formData.quartier} onChange={handleChange} className={inputClass} />
//           <input type="text" name="commune" placeholder="Commune" value={formData.commune} onChange={handleChange} className={inputClass} />
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <input type="number" name="superficieMin" placeholder="Superficie min (m²)" value={formData.superficieMin} onChange={handleChange} className={inputClass} />
//           <input type="number" name="superficieMax" placeholder="Superficie max (m²)" value={formData.superficieMax} onChange={handleChange} className={inputClass} />
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <select name="zonageSelect" value={formData.zonageSelect} onChange={handleChange} className={inputClass}>
//             <option value="">Zonage (sélection)</option>
//             <option value="Résidentiel">Résidentiel</option>
//             <option value="Commercial">Commercial</option>
//             <option value="Industriel">Industriel</option>
//             <option value="Mixte">Mixte</option>
//             <option value="Autre">Autre</option>
//           </select>
//           <input type="text" name="zonageText" placeholder="Autre zonage / description" value={formData.zonageText} onChange={handleChange} className={inputClass} />
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <input type="number" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} className={inputClass} />
//           <input type="number" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} className={inputClass} />
//         </div>

//         {/* Champs spécifiques */}
//         {Object.keys(champsSpecifiques).length > 0 && (
//           <div className="mt-4 space-y-2">
//             <h3 className="text-xl font-medium">Filtres spécifiques</h3>
//             {Object.entries(champsSpecifiques).map(([key, value]) => (
//               <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {typeof value === "boolean" ? (
//                   <label className="flex items-center gap-2">
//                     <input type="checkbox" checked={value} onChange={(e)=>setChampsSpecifiques(prev=>({...prev, [key]: e.target.checked}))} />
//                     {key}
//                   </label>
//                 ) : (
//                   <input
//                     type={["annee","kilometrage"].includes(key) ? "number" : "text"}
//                     name={key}
//                     placeholder={key}
//                     value={value}
//                     onChange={(e)=>setChampsSpecifiques(prev=>({...prev, [key]: e.target.value}))}
//                     className={inputClass}
//                   />
//                 )}
//               </div>
//             ))}



//             {formData.typeBien === "HOTEL" && champsSpecifiques.hotelGestion === "PAR_CHAMBRE" && (
//               <div className="mt-4">
//                 <h4 className="text-lg font-semibold">Chambres (hôtel)</h4>
//                 {(champsSpecifiques.chambres || []).map((c,i)=>
//                   <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
//                     <input type="text" placeholder="Numéro" value={c.numero} onChange={e=>{
//                       const arr = [...(champsSpecifiques.chambres||[])];
//                       arr[i] = { ...arr[i], numero: e.target.value };
//                       setChampsSpecifiques(prev=>({...prev, chambres: arr}));
//                     }} className={inputClass} />

//                     <select value={c.standing} onChange={e=>{
//                       const arr = [...(champsSpecifiques.chambres||[])];
//                       arr[i] = { ...arr[i], standing: e.target.value };
//                       setChampsSpecifiques(prev=>({...prev, chambres: arr}));
//                     }} className={inputClass}>
//                       <option value="">Standing</option>
//                       <option value="Standard">Standard</option>
//                       <option value="Confort">Confort</option>
//                       <option value="Suite">Suite</option>
//                     </select>

//                     <input type="number" placeholder={formData.mode==="VENTE" ? "Prix" : "Loyer"} value={formData.mode==="VENTE" ? c.prix : c.loyer} onChange={e=>{
//                       const val = e.target.value === "" ? "" : parseFloat(e.target.value);
//                       const arr = [...(champsSpecifiques.chambres||[])];
//                       if(formData.mode==="VENTE") arr[i] = { ...arr[i], prix: val };
//                       else arr[i] = { ...arr[i], loyer: val };
//                       setChampsSpecifiques(prev=>({...prev, chambres: arr}));
//                     }} className={inputClass} />

//                     <button type="button" onClick={()=>removeHotelChambre(i)} className="text-red-600">✕</button>
//                   </div>
//                 )}
//                 <button type="button" onClick={addHotelChambre} className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md">Ajouter chambre</button>
//               </div>
//             )}
//           </div>
//         )}

//         <button onClick={handleSouscription} disabled={loading} className="w-full bg-[#2EB5F9] hover:bg-[#005B9C] cursor-pointer text-white py-3 rounded-md mt-6">
//           {loading ? "Enregistrement..." : "Souscrire à ces critères"}
//         </button>
//       </div>
//     </div>
//   );
return (
  <div className="max-w-5xl mx-auto p-6 sm:p-10 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg mt-10 mb-20 border border-gray-100">
    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[#005B9C]">
      Souscrire aux annonces
    </h2>

    <p className="text-center text-gray-600 mb-8 text-sm sm:text-base">
      Les champs marqués d’un <span className="text-red-500 font-semibold">*</span> sont obligatoires.
    </p>

    {message && (
      <div
        className={`p-3 rounded-lg mb-6 text-center text-sm font-medium ${
          message.startsWith("✅")
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-yellow-100 text-yellow-700 border border-yellow-300"
        }`}
      >
        {message}
      </div>
    )}

    <div className="space-y-6">
      {/* Ligne 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          {renderLabel("typeBien", "Type de bien", true)}
          <select
            name="typeBien"
            value={formData.typeBien}
            onChange={handleTypeBienChange}
            className={inputClass}
          >
            <option value="">Sélectionnez le type de bien</option>
            {allTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.typeBien && (
            <p className="text-red-500 text-xs mt-1">{errors.typeBien}</p>
          )}
        </div>

        <div>
          {renderLabel("mode", "Mode", true)}
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Sélectionnez un mode</option>
            <option value="VENTE">Vente</option>
            <option value="LOCATION">Location</option>
          </select>
          {errors.mode && (
            <p className="text-red-500 text-xs mt-1">{errors.mode}</p>
          )}
        </div>
      </div>

      {/* Prix / Loyer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {formData.mode === "VENTE" && (
          <>
            <input
              type="number"
              name="prixMin"
              placeholder="Prix minimum"
              value={formData.prixMin}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              type="number"
              name="prixMax"
              placeholder="Prix maximum"
              value={formData.prixMax}
              onChange={handleChange}
              className={inputClass}
            />
          </>
        )}
        {formData.mode === "LOCATION" && (
          <>
            <input
              type="number"
              name="loyerMin"
              placeholder="Loyer minimum"
              value={formData.loyerMin}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              type="number"
              name="loyerMax"
              placeholder="Loyer maximum"
              value={formData.loyerMax}
              onChange={handleChange}
              className={inputClass}
            />
          </>
        )}
      </div>

      {/* Devise */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          {renderLabel("currency", "Devise", true)}
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Sélectionnez une devise</option>
            <option value="USD">USD ($)</option>
            <option value="CDF">CDF (Franc Congolais)</option>
            <option value="EUR">EUR (€)</option>
          </select>
          {errors.currency && (
            <p className="text-red-500 text-xs mt-1">{errors.currency}</p>
          )}
        </div>
      </div>

      {/* Localisation */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          {renderLabel("ville", "Ville", true)}
          <input
            type="text"
            name="ville"
            placeholder="Ex : Kinshasa"
            value={formData.ville}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.ville && (
            <p className="text-red-500 text-xs mt-1">{errors.ville}</p>
          )}
        </div>
        <input
          type="text"
          name="commune"
          placeholder="Commune"
          value={formData.commune}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="text"
          name="quartier"
          placeholder="Quartier"
          value={formData.quartier}
          onChange={handleChange}
          className={inputClass}
        />
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
  <div>
    {renderLabel("ville", "Ville", true)}
    <input
      type="text"
      name="ville"
      placeholder="Ex : Kinshasa"
      value={formData.ville}
      onChange={handleChange}
      className={inputClass}
    />
    {errors.ville && <p className="text-red-500 text-xs mt-1">{errors.ville}</p>}
  </div>

  <div>
    {renderLabel("commune", "Commune")}
    <input
      type="text"
      name="commune"
      placeholder="Commune"
      value={formData.commune}
      onChange={handleChange}
      className={inputClass}
    />
  </div>

  <div>
    {renderLabel("quartier", "Quartier")}
    <input
      type="text"
      name="quartier"
      placeholder="Quartier"
      value={formData.quartier}
      onChange={handleChange}
      className={inputClass}
    />
  </div>
</div>


      {/* Superficie */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <input
          type="number"
          name="superficieMin"
          placeholder="Superficie min (m²)"
          value={formData.superficieMin}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="number"
          name="superficieMax"
          placeholder="Superficie max (m²)"
          value={formData.superficieMax}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Zonage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <select
          name="zonageSelect"
          value={formData.zonageSelect}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Zonage (sélection)</option>
          <option value="Résidentiel">Résidentiel</option>
          <option value="Commercial">Commercial</option>
          <option value="Industriel">Industriel</option>
          <option value="Mixte">Mixte</option>
          <option value="Autre">Autre</option>
        </select>
        <input
          type="text"
          name="zonageText"
          placeholder="Autre zonage / description"
          value={formData.zonageText}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Coordonnées géographiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <input
          type="number"
          name="longitude"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
          className={inputClass}
        />
        <input
          type="number"
          name="latitude"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Champs spécifiques */}
      {Object.keys(champsSpecifiques).length > 0 && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-xl font-semibold text-[#005B9C] mb-3">
            Filtres spécifiques
          </h3>
          <div className="space-y-3">
            {Object.entries(champsSpecifiques).map(([key, value]) => (
              <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {typeof value === "boolean" ? (
                  <label className="flex items-center gap-2 text-gray-700">
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
                    type={
                      ["annee", "kilometrage"].includes(key)
                        ? "number"
                        : "text"
                    }
                    name={key}
                    placeholder={key}
                    value={value}
                    onChange={(e) =>
                      setChampsSpecifiques((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bouton principal */}
      <button
        onClick={handleSouscription}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-lg text-white transition-all duration-200 shadow-md ${
          loading
            ? "bg-[#2EB5F9]/70 cursor-not-allowed"
            : "bg-[#2EB5F9] hover:bg-[#005B9C]"
        }`}
      >
        {loading ? "Enregistrement..." : "Souscrire à ces critères"}
      </button>
    </div>
  </div>
);

}
