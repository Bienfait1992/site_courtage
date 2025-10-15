// import React, { useState, useEffect } from "react";
// import { useAuthStore } from "../../provider/useAuthStore";

// export const PubManager = () => {
//   const token = useAuthStore((state) => state.token);

//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({ sourceurl: "", images: [] });
//   const [mainImage, setMainImage] = useState(null);

//   const [pubs, setPubs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [dateFilter, setDateFilter] = useState("");
//   const [editingPub, setEditingPub] = useState(null); // null = création, sinon pub à modifier

//   const limit = 10;

//   const fetchPubs = async () => {
//     try {
//       setLoading(true);
//       let url = `http://localhost:3000/api/v1/pubs?limit=${limit}&page=${page}`;
//       if (dateFilter) url += `&date=${dateFilter}`;

//       const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
//       if (!res.ok) throw new Error("Erreur récupération pubs");
//       const data = await res.json();
//       setPubs(data.pubs);
//       setTotalPages(data.totalPages);
//     } catch (err) {
//       console.error(err);
//       setPubs([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPubs();
//   }, [page, dateFilter]);

//   const handleChange = (e) => {
//     const { name, files, value } = e.target;
//     if (name === "images") {
//       const selectedFiles = Array.from(files);
//       if (formData.images.length + selectedFiles.length > 10) {
//         alert("Maximum 10 images.");
//         return;
//       }
//       setFormData({ ...formData, images: [...formData.images, ...selectedFiles] });
//       if (!mainImage && selectedFiles.length > 0) setMainImage(selectedFiles[0]);
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     if (formData.images.length === 0 && !editingPub) 
//       return alert("Veuillez sélectionner au moins une image");
//     if (!formData.sourceurl) return alert("Veuillez renseigner la source");

//     const formPayload = new FormData();
//     formPayload.append("sourceurl", formData.sourceurl);
//     formData.images.forEach((img) => formPayload.append("image", img));

//     const url = editingPub
//       ? `http://localhost:3000/api/v1/pubs/${editingPub.id}`
//       : "http://localhost:3000/api/v1/pubs";

//     const method = editingPub ? "PUT" : "POST";

//     const res = await fetch(url, {
//       method,
//       headers: { Authorization: `Bearer ${token}` },
//       body: formPayload,
//     });

//     if (!res.ok) {
//       const errData = await res.json();
//       throw new Error(errData.message || "Erreur lors de l'opération");
//     }

//     alert(editingPub ? "Publicité modifiée avec succès !" : "Publicité créée avec succès !");
//     setFormData({ sourceurl: "", images: [] });
//     setMainImage(null);
//     setEditingPub(null);
//     setShowModal(false);
//     fetchPubs();
//   } catch (err) {
//     console.error(err);
//     alert("Erreur : " + err.message);
//   }
// };


// // Ouvrir modal pour création ou édition
// const openModal = (pub = null) => {
//   setEditingPub(pub);
//   if (pub) {
//     setFormData({ sourceurl: pub.sourceurl, images: [] });
//     setMainImage(pub.imageUrl ? pub.imageUrl : null);
//   } else {
//     setFormData({ sourceurl: "", images: [] });
//     setMainImage(null);
//   }
//   setShowModal(true);
// };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Voulez-vous vraiment supprimer cette pub ?")) return;
//     try {
//       const res = await fetch(`http://localhost:3000/api/v1/pubs/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Impossible de supprimer la pub");
//       fetchPubs();
//     } catch (err) {
//       console.error(err);
//       alert("Erreur : " + err.message);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 sm:px-6 md:px-20 lg:px-48 py-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl sm:text-3xl font-bold">Gestion des Publicités</h1>
//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Créer la pub
//         </button>
//       </div>

//       {/* Filtre par date */}
//       <div className="mb-4 flex items-center gap-2">
//         <label>Date :</label>
//         <input
//           type="date"
//           value={dateFilter}
//           onChange={(e) => setDateFilter(e.target.value)}
//           className="border px-2 py-1 rounded"
//         />
//       </div>

//       {/* Liste pubs */}
//       {loading ? (
//         <p>Chargement...</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {pubs.map((pub) => (
//             <div key={pub.id} className=" p-4 relative">
//               {pub.imageUrl && <img src={pub.imageUrl} alt="Pub" className="w-full h-48 object-cover rounded mb-2" />}
//               <p className="text-sm font-medium mb-2">Source: {pub.sourceurl}</p>
//               <div className="flex gap-2">
//                 <button
//   onClick={() => openModal(pub)}
//   className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
// >
//   Modifier
// </button>

//                 <button
//                   onClick={() => handleDelete(pub.id)}
//                   className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                 >
//                   Supprimer
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       <div className="flex justify-center gap-2 mt-4">
//         <button
//           disabled={page === 1}
//           onClick={() => setPage((p) => p - 1)}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Précédent
//         </button>
//         <span className="px-3 py-1 border rounded">{page}</span>
//         <button
//           disabled={page === totalPages}
//           onClick={() => setPage((p) => p + 1)}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Suivant
//         </button>
//       </div>

//       {/* Modal création pub */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded p-6 w-full max-w-lg relative">
//             <button
//               className="absolute top-2 right-2 text-gray-500 hover:text-black"
//               onClick={() => setShowModal(false)}
//             >
//               ×
//             </button>
//             <h2 className="text-xl font-bold mb-4">Créer une nouvelle publicité</h2>
//             <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
//               <input
//                 type="text"
//                 name="sourceurl"
//                 placeholder="Source / URL"
//                 value={formData.sourceurl}
//                 onChange={handleChange}
//                 className="border px-4 py-2 rounded w-full"
//                 required
//               />
//               <input
//                 type="file"
//                 name="images"
//                 accept="image/*"
//                 multiple
//                 onChange={handleChange}
//                 className="border px-4 py-2 rounded w-full"
//               />
//               <div className="mt-2 flex gap-2 overflow-x-auto">
//                 {formData.images.map((file, index) => (
//                   <div key={index} className="relative flex-shrink-0">
//                     <img
//                       src={URL.createObjectURL(file)}
//                       alt={`Image ${index + 1}`}
//                       className={`w-24 h-24 object-cover rounded cursor-pointer ${
//                         mainImage === file ? "ring-2 ring-blue-600" : ""
//                       }`}
//                       onMouseEnter={() => setMainImage(file)}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => {
//                         const newImages = formData.images.filter((_, i) => i !== index);
//                         setFormData({ ...formData, images: newImages });
//                         if (mainImage === file) setMainImage(newImages[0] || null);
//                       }}
//                       className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
//               >
//                 Créer la publicité
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../provider/useAuthStore";

export const PubManager = () => {
  const token = useAuthStore((state) => state.token);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ sourceurl: "", images: [] });
  const [mainImage, setMainImage] = useState(null);
  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFilter, setDateFilter] = useState("");
  const [editingPub, setEditingPub] = useState(null);

  const limit = 10;

  const fetchPubs = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:3000/api/v1/pubs?limit=${limit}&page=${page}`;
      if (dateFilter) url += `&date=${dateFilter}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Erreur récupération pubs");
      const data = await res.json();
      setPubs(data.pubs);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      setPubs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPubs();
  }, [page, dateFilter]);

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    if (name === "images") {
      const selectedFiles = Array.from(files);
      if (formData.images.length + selectedFiles.length > 10) {
        alert("Maximum 10 images.");
        return;
      }
      setFormData({ ...formData, images: [...formData.images, ...selectedFiles] });
      if (!mainImage && selectedFiles.length > 0) setMainImage(selectedFiles[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.images.length === 0 && !editingPub)
        return alert("Veuillez sélectionner au moins une image");
      if (!formData.sourceurl) return alert("Veuillez renseigner la source");

      const formPayload = new FormData();
      formPayload.append("sourceurl", formData.sourceurl);
      formData.images.forEach((img) => formPayload.append("image", img));

      const url = editingPub
        ? `http://localhost:3000/api/v1/pubs/${editingPub.id}`
        : "http://localhost:3000/api/v1/pubs";

      const method = editingPub ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Erreur lors de l'opération");
      }

      alert(editingPub ? "Publicité modifiée avec succès !" : "Publicité créée avec succès !");
      setFormData({ sourceurl: "", images: [] });
      setMainImage(null);
      setEditingPub(null);
      setShowModal(false);
      fetchPubs();
    } catch (err) {
      console.error(err);
      alert("Erreur : " + err.message);
    }
  };

  const openModal = (pub = null) => {
    setEditingPub(pub);
    if (pub) {
      setFormData({ sourceurl: pub.sourceurl, images: [] });
      setMainImage(pub.imageUrl || null);
    } else {
      setFormData({ sourceurl: "", images: [] });
      setMainImage(null);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette pub ?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/v1/pubs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Impossible de supprimer la pub");
      fetchPubs();
    } catch (err) {
      console.error(err);
      alert("Erreur : " + err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Gestion des Publicités</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
        >
          Ajouter la pub
        </button>
      </div>

      {/* Filtre par date */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <label className="text-sm font-medium">Date :</label>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border px-2 py-1 rounded w-full sm:w-auto"
        />
      </div>

      {/* Liste pubs */}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pubs.map((pub) => (
            <div key={pub.id} className="p-4  rounded shadow flex flex-col">
              {pub.imageUrl && (
                <img
                  src={pub.imageUrl}
                  alt="Pub"
                  className="w-full h-48 sm:h-56 md:h-48 lg:h-52 object-cover rounded mb-2"
                />
              )}
              <p className="text-sm font-medium mb-2 truncate">Source: {pub.sourceurl}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <button
                  onClick={() => openModal(pub)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex-1 sm:flex-auto"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(pub.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex-1 sm:flex-auto"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="px-3 py-1 border rounded">{page}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>

      {/* Modal création pub */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 p-4" style={{backgroundColor: "rgba(0,0,0,0.5)"}}>
          <div className="bg-white rounded p-6 w-full max-w-lg relative overflow-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editingPub ? "Modifier la publicité" : "Créer une nouvelle publicité"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="sourceurl"
                placeholder="Source / URL"
                value={formData.sourceurl}
                onChange={handleChange}
                className="border px-4 py-2 rounded w-full"
                required
              />
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="border px-4 py-2 rounded w-full"
              />
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Image ${index + 1}`}
                      className={`w-24 h-24 object-cover rounded cursor-pointer ${
                        mainImage === file ? "ring-2 ring-blue-600" : ""
                      }`}
                      onMouseEnter={() => setMainImage(file)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = formData.images.filter((_, i) => i !== index);
                        setFormData({ ...formData, images: newImages });
                        if (mainImage === file) setMainImage(newImages[0] || null);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                {editingPub ? "Modifier la publicité" : "Créer la publicité"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
