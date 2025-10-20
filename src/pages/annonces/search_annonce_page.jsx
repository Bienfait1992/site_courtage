import { useState } from "react";
import "react-phone-input-2/lib/style.css";

export default function SearchAnnonce() {
  const habitationTypes = ["MAISON", "VILLA", "APPARTEMENT", "STUDIO", "IMMEUBLE", "BUREAU", "LOCAL_COMMERCIAL"];
  const terrainTypes = ["PARCELLE"];
  const autreTypes = ["VEHICULE", "HOTEL", "ENTREPOT", "PARKING"];
  const allTypes = [...habitationTypes, ...terrainTypes, ...autreTypes];

  const [formData, setFormData] = useState({
    typeBien: "",
    mode: "",
    prixMin: "",
    prixMax: "",
    loyerMin: "",
    loyerMax: "",
    ville: "",
    quartier: "",
    commune: "",
    superficieMin: "",
    superficieMax: "",
    zonageSelect: "",
    zonageText: "",
    currency: "USD",
  });

  const [champsSpecifiques, setChampsSpecifiques] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeBienChange = (e) => {
    const type = e.target.value;
    setFormData((prev) => ({ ...prev, typeBien: type }));
    switch (type) {
      case "MAISON":
      case "VILLA":
      case "APPARTEMENT":
      case "STUDIO":
      case "IMMEUBLE":
        setChampsSpecifiques({ nombreChambres: "", garage: false });
        break;
      case "VEHICULE":
        setChampsSpecifiques({ marque: "", modele: "", annee: "", kilometrage: "" });
        break;
      case "HOTEL":
        setChampsSpecifiques({ hotelGestion: "ENTIER", chambres: [] });
        break;
      default:
        setChampsSpecifiques({});
    }
  };

  const addHotelChambre = () => {
    setChampsSpecifiques((prev) => {
      const existing = prev.chambres ? [...prev.chambres] : [];
      existing.push({ numero: "", standing: "", prix: "", loyer: "", currency: formData.currency || "USD" });
      return { ...prev, chambres: existing };
    });
  };

  const removeHotelChambre = (index) => {
    setChampsSpecifiques((prev) => {
      const existing = prev.chambres ? prev.chambres.filter((_, i) => i !== index) : [];
      return { ...prev, chambres: existing };
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchFilters = { ...formData, detailsFilters: champsSpecifiques };

      // Détecter si des filtres avancés sont présents
      const hasAdvanced = Object.keys(champsSpecifiques).length > 0 || formData.superficieMin || formData.superficieMax || formData.zonageSelect || formData.zonageText;

      let response;
      if (hasAdvanced) {
        // POST pour recherche avancée
        response = await fetch("http://localhost:3000/api/v1/search-advanced", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "",
          },
          body: JSON.stringify(searchFilters),
        });
      } else {
        // GET pour recherche simple
        const query = new URLSearchParams(formData).toString();
        response = await fetch(`http://localhost:3000/api/v1/search-advanced?${query}`, {
          headers: {
            Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "",
          },
        });
      }

      const result = await response.json();
      if (response.ok) {
        setSearchResults(result.annonces || []);
        setSuggestions(result.suggestions || []);
      } else {
        console.error(result.message);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "border p-2 rounded-md w-full";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 mb-16">
      <h2 className="text-2xl font-semibold text-center mb-4">Recherche avancée</h2>

      <div className="space-y-3">
        <select name="typeBien" value={formData.typeBien} onChange={handleTypeBienChange} className={inputClass}>
          <option value="">Type de bien</option>
          {allTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>

        <select name="mode" value={formData.mode} onChange={handleChange} className={inputClass}>
          <option value="">Mode</option>
          <option value="VENTE">Vente</option>
          <option value="LOCATION">Location</option>
        </select>

        <div className="grid grid-cols-2 gap-2">
          <input type="number" name="prixMin" placeholder="Prix min" value={formData.prixMin} onChange={handleChange} className={inputClass} />
          <input type="number" name="prixMax" placeholder="Prix max" value={formData.prixMax} onChange={handleChange} className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input type="number" name="loyerMin" placeholder="Loyer min" value={formData.loyerMin} onChange={handleChange} className={inputClass} />
          <input type="number" name="loyerMax" placeholder="Loyer max" value={formData.loyerMax} onChange={handleChange} className={inputClass} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <input type="text" name="ville" placeholder="Ville" value={formData.ville} onChange={handleChange} className={inputClass} />
          <input type="text" name="quartier" placeholder="Quartier" value={formData.quartier} onChange={handleChange} className={inputClass} />
          <input type="text" name="commune" placeholder="Commune" value={formData.commune} onChange={handleChange} className={inputClass} />
        </div>

        {/* Champs spécifiques */}
        {Object.keys(champsSpecifiques).length > 0 && formData.typeBien !== "HOTEL" && (
          <div className="space-y-2">
            {Object.entries(champsSpecifiques).map(([key, value]) =>
              typeof value === "boolean" ? (
                <label key={key} className="flex items-center gap-2">
                  <input type="checkbox" checked={value} onChange={(e) => setChampsSpecifiques((prev) => ({ ...prev, [key]: e.target.checked }))} />
                  {key}
                </label>
              ) : (
                <input key={key} type={["annee", "kilometrage"].includes(key) ? "number" : "text"} name={key} placeholder={key} value={value} onChange={(e) => setChampsSpecifiques((prev) => ({ ...prev, [key]: e.target.value }))} className={inputClass} />
              )
            )}
          </div>
        )}

        {/* Hôtel */}
        {formData.typeBien === "HOTEL" && champsSpecifiques.hotelGestion === "PAR_CHAMBRE" && (
          <div className="space-y-2">
            <h3 className="font-semibold">Chambres</h3>
            {(champsSpecifiques.chambres || []).map((c, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 items-center">
                <input type="text" placeholder="Numéro" value={c.numero} onChange={(e) => {
                  const newChambres = [...champsSpecifiques.chambres];
                  newChambres[i] = { ...newChambres[i], numero: e.target.value };
                  setChampsSpecifiques((prev) => ({ ...prev, chambres: newChambres }));
                }} className={inputClass} />
                <select value={c.standing} onChange={(e) => {
                  const newChambres = [...champsSpecifiques.chambres];
                  newChambres[i] = { ...newChambres[i], standing: e.target.value };
                  setChampsSpecifiques((prev) => ({ ...prev, chambres: newChambres }));
                }} className={inputClass}>
                  <option value="">Standing</option>
                  <option value="Standard">Standard</option>
                  <option value="Confort">Confort</option>
                  <option value="Suite">Suite</option>
                </select>
                <input type="number" placeholder={formData.mode === "VENTE" ? "Prix" : "Loyer"} value={formData.mode === "VENTE" ? c.prix : c.loyer} onChange={(e) => {
                  const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                  const newChambres = [...champsSpecifiques.chambres];
                  if (formData.mode === "VENTE") newChambres[i] = { ...newChambres[i], prix: val };
                  else newChambres[i] = { ...newChambres[i], loyer: val };
                  setChampsSpecifiques((prev) => ({ ...prev, chambres: newChambres }));
                }} className={inputClass} />
                <button type="button" onClick={() => removeHotelChambre(i)} className="text-red-600">✕</button>
              </div>
            ))}
            <button type="button" onClick={addHotelChambre} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2">Ajouter chambre</button>
          </div>
        )}

        <button onClick={handleSearch} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md mt-4" disabled={loading}>
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </div>

      {/* Résultats */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Résultats exacts</h2>
        {searchResults.length === 0 ? <p>Aucun résultat correspondant</p> : (
          searchResults.map((a) => (
            <div key={a.id} className="border p-2 rounded-md mb-2">
              <h3 className="font-semibold">{a.titre}</h3>
              <p>{a.description}</p>
              <p>{a.prix ? `${a.prix} ${a.currency}` : a.loyer ? `${a.loyer} ${a.currency}` : ""}</p>
              {a.images && a.images.map(img => <img key={img.id} src={img.url} alt={a.titre} width={100} />)}
            </div>
          ))
        )}

        <h2 className="text-xl font-semibold mt-4 mb-2">Suggestions similaires</h2>
        {suggestions.length === 0 ? <p>Aucune suggestion</p> : (
          suggestions.map((a) => (
            <div key={a.id} className="border p-2 rounded-md mb-2 opacity-70">
              <h3 className="font-semibold">{a.titre}</h3>
              <p>{a.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
