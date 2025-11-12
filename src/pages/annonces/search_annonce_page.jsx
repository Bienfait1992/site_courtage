// import { useState } from "react";
// import "react-phone-input-2/lib/style.css";

// export default function SearchAnnonce() {
//   const habitationTypes = ["MAISON", "VILLA", "APPARTEMENT", "STUDIO", "IMMEUBLE", "BUREAU", "LOCAL_COMMERCIAL"];
//   const terrainTypes = ["PARCELLE"];
//   const autreTypes = ["VEHICULE", "HOTEL", "ENTREPOT", "PARKING"];
//   const allTypes = [...habitationTypes, ...terrainTypes, ...autreTypes];

//   const [formData, setFormData] = useState({
//     typeBien: "",
//     mode: "",
//     prixMin: "",
//     prixMax: "",
//     loyerMin: "",
//     loyerMax: "",
//     ville: "",
//     quartier: "",
//     commune: "",
//     superficieMin: "",
//     superficieMax: "",
//     zonageSelect: "",
//     zonageText: "",
//     currency: "USD",
//   });

//   const [champsSpecifiques, setChampsSpecifiques] = useState({});
//   const [searchResults, setSearchResults] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleTypeBienChange = (e) => {
//     const type = e.target.value;
//     setFormData((prev) => ({ ...prev, typeBien: type }));
//     switch (type) {
//       case "MAISON":
//       case "VILLA":
//       case "APPARTEMENT":
//       case "STUDIO":
//       case "IMMEUBLE":
//         setChampsSpecifiques({ nombreChambres: "", garage: false });
//         break;
//       case "VEHICULE":
//         setChampsSpecifiques({ marque: "", modele: "", annee: "", kilometrage: "" });
//         break;
//       case "HOTEL":
//         setChampsSpecifiques({ hotelGestion: "ENTIER", chambres: [] });
//         break;
//       default:
//         setChampsSpecifiques({});
//     }
//   };

//   const addHotelChambre = () => {
//     setChampsSpecifiques((prev) => {
//       const existing = prev.chambres ? [...prev.chambres] : [];
//       existing.push({ numero: "", standing: "", prix: "", loyer: "", currency: formData.currency || "USD" });
//       return { ...prev, chambres: existing };
//     });
//   };

//   const removeHotelChambre = (index) => {
//     setChampsSpecifiques((prev) => {
//       const existing = prev.chambres ? prev.chambres.filter((_, i) => i !== index) : [];
//       return { ...prev, chambres: existing };
//     });
//   };

//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       const searchFilters = { ...formData, detailsFilters: champsSpecifiques };

//       // Détecter si des filtres avancés sont présents
//       const hasAdvanced = Object.keys(champsSpecifiques).length > 0 || formData.superficieMin || formData.superficieMax || formData.zonageSelect || formData.zonageText;

//       let response;
//       if (hasAdvanced) {
//         // POST pour recherche avancée
//         response = await fetch("http://localhost:3000/api/v1/search-advanced", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "",
//           },
//           body: JSON.stringify(searchFilters),
//         });
//       } else {
//         // GET pour recherche simple
//         const query = new URLSearchParams(formData).toString();
//         response = await fetch(`http://localhost:3000/api/v1/search-advanced?${query}`, {
//           headers: {
//             Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "",
//           },
//         });
//       }

//       const result = await response.json();
//       if (response.ok) {
//         setSearchResults(result.annonces || []);
//         setSuggestions(result.suggestions || []);
//       } else {
//         console.error(result.message);
//       }
//     } catch (err) {
//       console.error("Erreur réseau :", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputClass = "border p-2 rounded-md w-full";

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 mb-16">
//       <h2 className="text-2xl font-semibold text-center mb-4">Recherche avancée</h2>

//       <div className="space-y-3">
//         <select name="typeBien" value={formData.typeBien} onChange={handleTypeBienChange} className={inputClass}>
//           <option value="">Type de bien</option>
//           {allTypes.map((type) => <option key={type} value={type}>{type}</option>)}
//         </select>

//         <select name="mode" value={formData.mode} onChange={handleChange} className={inputClass}>
//           <option value="">Mode</option>
//           <option value="VENTE">Vente</option>
//           <option value="LOCATION">Location</option>
//         </select>

//         <div className="grid grid-cols-2 gap-2">
//           <input type="number" name="prixMin" placeholder="Prix min" value={formData.prixMin} onChange={handleChange} className={inputClass} />
//           <input type="number" name="prixMax" placeholder="Prix max" value={formData.prixMax} onChange={handleChange} className={inputClass} />
//         </div>

//         <div className="grid grid-cols-2 gap-2">
//           <input type="number" name="loyerMin" placeholder="Loyer min" value={formData.loyerMin} onChange={handleChange} className={inputClass} />
//           <input type="number" name="loyerMax" placeholder="Loyer max" value={formData.loyerMax} onChange={handleChange} className={inputClass} />
//         </div>

//         <div className="grid grid-cols-3 gap-2">
//           <input type="text" name="ville" placeholder="Ville" value={formData.ville} onChange={handleChange} className={inputClass} />
//           <input type="text" name="quartier" placeholder="Quartier" value={formData.quartier} onChange={handleChange} className={inputClass} />
//           <input type="text" name="commune" placeholder="Commune" value={formData.commune} onChange={handleChange} className={inputClass} />
//         </div>

//         {/* Champs spécifiques */}
//         {Object.keys(champsSpecifiques).length > 0 && formData.typeBien !== "HOTEL" && (
//           <div className="space-y-2">
//             {Object.entries(champsSpecifiques).map(([key, value]) =>
//               typeof value === "boolean" ? (
//                 <label key={key} className="flex items-center gap-2">
//                   <input type="checkbox" checked={value} onChange={(e) => setChampsSpecifiques((prev) => ({ ...prev, [key]: e.target.checked }))} />
//                   {key}
//                 </label>
//               ) : (
//                 <input key={key} type={["annee", "kilometrage"].includes(key) ? "number" : "text"} name={key} placeholder={key} value={value} onChange={(e) => setChampsSpecifiques((prev) => ({ ...prev, [key]: e.target.value }))} className={inputClass} />
//               )
//             )}
//           </div>
//         )}

//         {/* Hôtel */}
//         {formData.typeBien === "HOTEL" && champsSpecifiques.hotelGestion === "PAR_CHAMBRE" && (
//           <div className="space-y-2">
//             <h3 className="font-semibold">Chambres</h3>
//             {(champsSpecifiques.chambres || []).map((c, i) => (
//               <div key={i} className="grid grid-cols-4 gap-2 items-center">
//                 <input type="text" placeholder="Numéro" value={c.numero} onChange={(e) => {
//                   const newChambres = [...champsSpecifiques.chambres];
//                   newChambres[i] = { ...newChambres[i], numero: e.target.value };
//                   setChampsSpecifiques((prev) => ({ ...prev, chambres: newChambres }));
//                 }} className={inputClass} />
//                 <select value={c.standing} onChange={(e) => {
//                   const newChambres = [...champsSpecifiques.chambres];
//                   newChambres[i] = { ...newChambres[i], standing: e.target.value };
//                   setChampsSpecifiques((prev) => ({ ...prev, chambres: newChambres }));
//                 }} className={inputClass}>
//                   <option value="">Standing</option>
//                   <option value="Standard">Standard</option>
//                   <option value="Confort">Confort</option>
//                   <option value="Suite">Suite</option>
//                 </select>
//                 <input type="number" placeholder={formData.mode === "VENTE" ? "Prix" : "Loyer"} value={formData.mode === "VENTE" ? c.prix : c.loyer} onChange={(e) => {
//                   const val = e.target.value === "" ? "" : parseFloat(e.target.value);
//                   const newChambres = [...champsSpecifiques.chambres];
//                   if (formData.mode === "VENTE") newChambres[i] = { ...newChambres[i], prix: val };
//                   else newChambres[i] = { ...newChambres[i], loyer: val };
//                   setChampsSpecifiques((prev) => ({ ...prev, chambres: newChambres }));
//                 }} className={inputClass} />
//                 <button type="button" onClick={() => removeHotelChambre(i)} className="text-red-600">✕</button>
//               </div>
//             ))}
//             <button type="button" onClick={addHotelChambre} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2">Ajouter chambre</button>
//           </div>
//         )}

//         <button onClick={handleSearch} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md mt-4" disabled={loading}>
//           {loading ? "Recherche..." : "Rechercher"}
//         </button>
//       </div>

//       {/* Résultats */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-2">Résultats exacts</h2>
//         {searchResults.length === 0 ? <p>Aucun résultat correspondant</p> : (
//           searchResults.map((a) => (
//             <div key={a.id} className="border p-2 rounded-md mb-2">
//               <h3 className="font-semibold">{a.titre}</h3>
//               <p>{a.description}</p>
//               <p>{a.prix ? `${a.prix} ${a.currency}` : a.loyer ? `${a.loyer} ${a.currency}` : ""}</p>
//               {a.images && a.images.map(img => <img key={img.id} src={img.url} alt={a.titre} width={100} />)}
//             </div>
//           ))
//         )}

//         <h2 className="text-xl font-semibold mt-4 mb-2">Suggestions similaires</h2>
//         {suggestions.length === 0 ? <p>Aucune suggestion</p> : (
//           suggestions.map((a) => (
//             <div key={a.id} className="border p-2 rounded-md mb-2 opacity-70">
//               <h3 className="font-semibold">{a.titre}</h3>
//               <p>{a.description}</p>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };


import { useState, useEffect } from "react";

export default function SearchAnnonce() {
  const habitationTypes = ["MAISON","VILLA","APPARTEMENT","STUDIO","IMMEUBLE","BUREAU","LOCAL_COMMERCIAL"];
  const terrainTypes   = ["PARCELLE"];
  const autreTypes     = ["VEHICULE","HOTEL","ENTREPOT","PARKING"];
  const allTypes       = [...habitationTypes, ...terrainTypes, ...autreTypes];

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
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [geoZone, setGeoZone] = useState(null); // pour zone géographique si besoin

  // Gérer changements formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeBienChange = (e) => {
    const type = e.target.value;
    setFormData(prev => ({ ...prev, typeBien: type }));
    // init champs spécifiques selon type
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


  const handleSearch = async () => {
  setLoading(true);
  try {
    // Nettoyer les champs vides
    const cleanedForm = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "" && v !== null)
    );

    const filters = { ...cleanedForm, detailsFilters: champsSpecifiques };

    // Déterminer si la recherche est avancée
    const hasAdvanced =
      Object.keys(champsSpecifiques).length > 0 ||
      formData.superficieMin ||
      formData.superficieMax ||
      formData.zonageSelect ||
      formData.zonageText ||
      formData.latitude ||
      formData.longitude;

    const token = localStorage.getItem("token");
    let response;

    if (hasAdvanced) {
      // 🔹 POST : recherche avancée
      response = await fetch("http://localhost:3000/api/v1/search-advanced", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(filters),
      });
    } else {
      // 🔹 GET : recherche simple
      const query = new URLSearchParams(cleanedForm).toString();
      response = await fetch(`http://localhost:3000/api/v1/search-advanced?${query}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
    }

    const result = await response.json();

    if (response.ok) {
      setSearchResults(result.annonces || []);
      setSuggestions(result.suggestions || []);
    } else {
      console.error("Search error:", result.message);
    }
  } catch (err) {
    console.error("Network error:", err);
  } finally {
    setLoading(false);
  }
};


  const inputClass = "border p-2 rounded-md w-full";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 mb-16">
      <h2 className="text-3xl font-semibold text-center mb-6">Trouver une annonce</h2>

      {/* Formulaire de recherche */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="typeBien" value={formData.typeBien} onChange={handleTypeBienChange} className={inputClass}>
            <option value="">Type de bien</option>
            {allTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>

          <select name="mode" value={formData.mode} onChange={handleChange} className={inputClass}>
            <option value="">Mode</option>
            <option value="VENTE">Vente</option>
            <option value="LOCATION">Location</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input type="number" name="prixMin" placeholder="Prix min" value={formData.prixMin} onChange={handleChange} className={inputClass} />
          <input type="number" name="prixMax" placeholder="Prix max" value={formData.prixMax} onChange={handleChange} className={inputClass} />
          <input type="number" name="loyerMin" placeholder="Loyer min" value={formData.loyerMin} onChange={handleChange} className={inputClass} />
          <input type="number" name="loyerMax" placeholder="Loyer max" value={formData.loyerMax} onChange={handleChange} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input type="text" name="ville" placeholder="Ville" value={formData.ville} onChange={handleChange} className={inputClass} />
          <input type="text" name="quartier" placeholder="Quartier" value={formData.quartier} onChange={handleChange} className={inputClass} />
          <input type="text" name="commune" placeholder="Commune" value={formData.commune} onChange={handleChange} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="number" name="superficieMin" placeholder="Superficie min (m²)" value={formData.superficieMin} onChange={handleChange} className={inputClass} />
          <input type="number" name="superficieMax" placeholder="Superficie max (m²)" value={formData.superficieMax} onChange={handleChange} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select name="zonageSelect" value={formData.zonageSelect} onChange={handleChange} className={inputClass}>
            <option value="">Zonage (sélection)</option>
            <option value="Résidentiel">Résidentiel</option>
            <option value="Commercial">Commercial</option>
            <option value="Industriel">Industriel</option>
            <option value="Mixte">Mixte</option>
            <option value="Autre">Autre</option>
          </select>
          <input type="text" name="zonageText" placeholder="Autre zonage / description" value={formData.zonageText} onChange={handleChange} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="number" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} className={inputClass} />
          <input type="number" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} className={inputClass} />
        </div>

        {/* Champs spécifiques dynamiques */}
        {Object.keys(champsSpecifiques).length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="text-xl font-medium">Filtres spécifiques</h3>
            {Object.entries(champsSpecifiques).map(([key, value]) => (
              <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {typeof value === "boolean" ? (
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={value} onChange={(e)=>setChampsSpecifiques(prev=>({...prev, [key]: e.target.checked}))} />
                    {key}
                  </label>
                ) : (
                  <input
                    type={["annee","kilometrage"].includes(key) ? "number" : "text"}
                    name={key}
                    placeholder={key}
                    value={value}
                    onChange={(e)=>setChampsSpecifiques(prev=>({...prev, [key]: e.target.value}))}
                    className={inputClass}
                  />
                )}
              </div>
            ))}
            {formData.typeBien === "HOTEL" && champsSpecifiques.hotelGestion === "PAR_CHAMBRE" && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Chambres (hôtel)</h4>
                {(champsSpecifiques.chambres || []).map((c,i)=>
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                    <input type="text" placeholder="Numéro" value={c.numero} onChange={e=>{
                      const arr = [...(champsSpecifiques.chambres||[])];
                      arr[i] = { ...arr[i], numero: e.target.value };
                      setChampsSpecifiques(prev=>({...prev, chambres: arr}));
                    }} className={inputClass} />

                    <select value={c.standing} onChange={e=>{
                      const arr = [...(champsSpecifiques.chambres||[])];
                      arr[i] = { ...arr[i], standing: e.target.value };
                      setChampsSpecifiques(prev=>({...prev, chambres: arr}));
                    }} className={inputClass}>
                      <option value="">Standing</option>
                      <option value="Standard">Standard</option>
                      <option value="Confort">Confort</option>
                      <option value="Suite">Suite</option>
                    </select>

                    <input type="number" placeholder={formData.mode==="VENTE" ? "Prix" : "Loyer"} value={formData.mode==="VENTE" ? c.prix : c.loyer} onChange={e=>{
                      const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                      const arr = [...(champsSpecifiques.chambres||[])];
                      if(formData.mode==="VENTE")
                        arr[i] = { ...arr[i], prix: val };
                      else
                        arr[i] = { ...arr[i], loyer: val };
                      setChampsSpecifiques(prev=>({...prev, chambres: arr}));
                    }} className={inputClass} />

                    <button type="button" onClick={()=>removeHotelChambre(i)} className="text-red-600">✕</button>
                  </div>
                )}
                <button type="button" onClick={addHotelChambre} className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md">Ajouter chambre</button>
              </div>
            )}
          </div>
        )}

        <button onClick={handleSearch} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md mt-6">
          {loading ? "Chargement…" : "Lancer la recherche"}
        </button>
      </div>

      {/* Résultats */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Résultats trouvés</h2>
        {searchResults.length === 0 ? (
          <p className="text-gray-600">Aucune annonce ne correspond à vos critères pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.map((a) => (
              <div key={a.id} className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition">
                {/* <img src={a.images && a.images[0]?.url} alt={a.titre} className="w-full h-48 object-cover" /> */}
                 <img
                src={`http://localhost:3000${a.images[0].url}`}
                alt={a.titre}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{a.titre}</h3>
                  <p className="text-sm text-gray-500">{a.ville} — {a.quartier}</p>
                  <p className="mt-2 font-medium">{a.prix ? `${a.prix} ${a.currency}` : a.loyer ? `${a.loyer} ${a.currency}/mois` : ""}</p>
                  <p className="mt-1 text-gray-700">{a.description.slice(0, 100)}…</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Suggestions pour vous</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {suggestions.map((a) => (
                <div key={a.id} className="border rounded-md overflow-hidden shadow-sm opacity-80 hover:opacity-100 transition">
                  <img src={a.images && a.images[0]?.url} alt={a.titre} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{a.titre}</h3>
                    <p className="text-sm text-gray-500">{a.ville} — {a.quartier}</p>
                    <p className="mt-2 font-medium">{a.prix ? `${a.prix} ${a.currency}` : a.loyer ? `${a.loyer} ${a.currency}/mois` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


  // const handleSearch = async () => {
  //   setLoading(true);
  //   try {
  //     const filters = { ...formData, detailsFilters: champsSpecifiques };

  //     const hasAdvanced = Object.keys(champsSpecifiques).length > 0 
  //       || formData.superficieMin || formData.superficieMax 
  //       || formData.zonageSelect || formData.zonageText 
  //       || formData.latitude || formData.longitude;

  //     const token = localStorage.getItem("token");
  //     let response;

  //     if (hasAdvanced) {
  //       response = await fetch("http://localhost:3000/api/v1/search-advanced", {
  //         method:"POST",
  //         headers:{
  //           "Content-Type":"application/json",
  //           Authorization: token ? `Bearer ${token}` : ""
  //         },
  //         body: JSON.stringify(filters),
  //       });
  //     } else {
  //       const query = new URLSearchParams(formData).toString();
  //       response = await fetch(`http://localhost:3000/api/v1/search-advanced?${query}`, {
  //         headers:{
  //           Authorization: token ? `Bearer ${token}` : ""
  //         },
  //       });
  //     }

  //     const result = await response.json();
  //     if (response.ok) {
  //       setSearchResults(result.annonces || []);
  //       setSuggestions(result.suggestions || []);
  //     } else {
  //       console.error("Search error:", result.message);
  //     }
  //   } catch(err) {
  //     console.error("Network error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };