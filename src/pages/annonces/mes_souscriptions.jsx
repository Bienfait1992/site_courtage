import { useState, useEffect } from "react";

export default function MesSouscriptions() {
  const [souscriptions, setSouscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [annonces, setAnnonces] = useState({});
  const token = localStorage.getItem("token");

  // 🔹 Récupérer les souscriptions de l'utilisateur
  const fetchSouscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/v1/souscriptions", {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      if (res.ok) {
        setSouscriptions(data.souscriptions || []);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSouscriptions();
  }, []);

  // Récupérer les nouvelles annonces pour une souscription
  const fetchNouvellesAnnonces = async (souscriptionId, criteres) => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/search-advanced", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(criteres),
      });
      const data = await res.json();
      if (res.ok) {
        setAnnonces(prev => ({ ...prev, [souscriptionId]: data.annonces || [] }));
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Erreur réseau:", err);
    }
  };

  const inputClass = "border p-2 rounded-md w-full";

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10 mb-16">
      <h2 className="text-3xl font-semibold text-center mb-6">Mes Souscriptions</h2>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : souscriptions.length === 0 ? (
        <p className="text-center text-gray-600">Vous n'avez aucune souscription pour le moment.</p>
      ) : (
        <div className="space-y-6">
          {souscriptions.map(sub => (
            <div key={sub.id} className="border rounded-md p-4 shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">{sub.typeBien} — {sub.mode}</h3>
              <p className="text-gray-600 mb-2">
                {sub.ville ? `${sub.ville}, ` : ""}{sub.quartier ? `${sub.quartier}` : ""}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-sm bg-gray-100 p-1 rounded">Prix: {sub.prixMin || "-"} - {sub.prixMax || "-"}</span>
                <span className="text-sm bg-gray-100 p-1 rounded">Loyer: {sub.loyerMin || "-"} - {sub.loyerMax || "-"}</span>
                {sub.superficieMin && <span className="text-sm bg-gray-100 p-1 rounded">Superficie min: {sub.superficieMin}</span>}
                {sub.superficieMax && <span className="text-sm bg-gray-100 p-1 rounded">Superficie max: {sub.superficieMax}</span>}
                {sub.detailsFilters && Object.keys(sub.detailsFilters).map(key => (
                  <span key={key} className="text-sm bg-gray-100 p-1 rounded">{key}: {JSON.stringify(sub.detailsFilters[key])}</span>
                ))}
              </div>

              <button
                onClick={() => fetchNouvellesAnnonces(sub.id, { ...sub, detailsFilters: sub.detailsFilters })}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                Voir nouvelles annonces
              </button>

              {/* Affichage des nouvelles annonces */}
              {annonces[sub.id] && annonces[sub.id].length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {annonces[sub.id].map(a => (
                    <div key={a.id} className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition">
                      <img
                        src={a.images && a.images[0]?.url ? `http://localhost:3000${a.images[0].url}` : ""}
                        alt={a.titre}
                        className="w-full h-48 object-cover rounded-md mb-3"
                      />
                      <div className="p-3">
                        <h4 className="font-semibold">{a.titre}</h4>
                        <p className="text-sm text-gray-500">{a.ville} — {a.quartier}</p>
                        <p className="mt-1 font-medium">{a.prix ? `${a.prix} ${a.currency}` : a.loyer ? `${a.loyer} ${a.currency}/mois` : ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
