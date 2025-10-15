// import React, { useState } from "react";
// import {
//   FaUserCircle,
//   FaEnvelope,
//   FaPhone,
//   FaEdit,
//   FaTrash,
//   FaChartPie,
//   FaBars,
//   FaHome,
//   FaUser,
//   FaCog,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import { NavLink } from "react-router-dom";

// // Mock utilisateur
// const userMockInitial = {
//   nom: "Jean Mbayo",
//   email: "jean.mbayo@example.com",
//   telephone: "0999999999",
//   avatar: null,
// };

// // Mock annonces
// const initialAnnonces = [
//   { id: 1, titre: "Ordinateur portable Dell", prix: 500, image: "/assets/ordinateur-dell.jpg" },
//   { id: 2, titre: "Smart TV Samsung 50 pouces", prix: 700, image: "/assets/tv-samsung.jpg" },
// ];

// export const ProfilePage = () => {
//   const [annonces, setAnnonces] = useState(initialAnnonces);
//   const [user, setUser] = useState(userMockInitial);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   // Modale profil
//   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
//   const [previewAvatar, setPreviewAvatar] = useState(user.avatar);

//   // Modale édition annonce
//   const [editAnnonce, setEditAnnonce] = useState(null);
//   const [isAnnonceModalOpen, setIsAnnonceModalOpen] = useState(false);
//   const [previewAnnonceImage, setPreviewAnnonceImage] = useState(null);

//   // Sidebar links
//   const links = [
//     { to: "/", icon: <FaHome />, label: "Accueil" },
//     { to: "/profile", icon: <FaUser />, label: "Profil" },
//     { to: "/settings", icon: <FaCog />, label: "Paramètres" },
//   ];

//   // Actions annonces
//   const supprimerAnnonce = (id) => setAnnonces(annonces.filter((ann) => ann.id !== id));
//   const terminerAnnonce = (id) => setAnnonces(annonces.filter((ann) => ann.id !== id));

//   const ouvrirModaleAnnonce = (ann) => {
//     setEditAnnonce(ann);
//     setPreviewAnnonceImage(ann.image);
//     setIsAnnonceModalOpen(true);
//   };

//   const handleSaveAnnonce = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     setAnnonces(
//       annonces.map((ann) =>
//         ann.id === editAnnonce.id
//           ? {
//               ...ann,
//               titre: formData.get("titre"),
//               prix: formData.get("prix"),
//               image: previewAnnonceImage,
//             }
//           : ann
//       )
//     );
//     setIsAnnonceModalOpen(false);
//     setEditAnnonce(null);
//   };

//   // Modale profil
//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => setPreviewAvatar(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveProfile = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     setUser({
//       nom: formData.get("nom"),
//       email: formData.get("email"),
//       telephone: formData.get("telephone"),
//       avatar: previewAvatar,
//     });
//     setIsProfileModalOpen(false);
//     alert("Profil mis à jour avec succès !");
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className={`${isSidebarOpen ? "w-64" : "w-16"} bg-blue-600 text-white min-h-screen transition-all duration-300 flex flex-col`}>
//         <button className="p-4 text-xl focus:outline-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//           <FaBars />
//         </button>
//         <nav className="flex-1">
//           {links.map((link) => (
//             <NavLink key={link.to} to={link.to} className="flex items-center gap-3 px-4 py-2 hover:bg-blue-500">
//               {link.icon} {isSidebarOpen && <span>{link.label}</span>}
//             </NavLink>
//           ))}
//         </nav>
//         <button className="flex items-center gap-3 px-4 py-2 hover:bg-red-500">
//           <FaSignOutAlt /> {isSidebarOpen && <span>Déconnexion</span>}
//         </button>
//       </div>

//       {/* Contenu principal */}
//       <div className="flex-1 p-6">
//         {/* Profil */}
//         <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex items-center gap-6">
//           {user.avatar ? (
//             <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
//           ) : (
//             <FaUserCircle className="w-24 h-24 text-gray-400" />
//           )}
//           <div>
//             <h1 className="text-2xl font-bold">{user.nom}</h1>
//             <p className="flex items-center gap-2 text-gray-600"><FaEnvelope /> {user.email}</p>
//             <p className="flex items-center gap-2 text-gray-600"><FaPhone /> {user.telephone}</p>
//           </div>
//           <button
//             className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//             onClick={() => { setPreviewAvatar(user.avatar); setIsProfileModalOpen(true); }}
//           >
//             <FaEdit /> Modifier le profil
//           </button>
//         </div>

//         {/* Statistiques */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
//             <FaChartPie className="text-blue-600 text-3xl mb-2" />
//             <p className="text-gray-600">Total annonces</p>
//             <p className="text-xl font-bold">{annonces.length}</p>
//           </div>
//           <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
//             <FaChartPie className="text-green-600 text-3xl mb-2" />
//             <p className="text-gray-600">Total vues</p>
//             <p className="text-xl font-bold">123</p>
//           </div>
//           <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
//             <FaChartPie className="text-purple-600 text-3xl mb-2" />
//             <p className="text-gray-600">Contacts reçus</p>
//             <p className="text-xl font-bold">45</p>
//           </div>
//         </div>

//         {/* Annonces */}
//         <h2 className="text-xl font-semibold mb-4">Mes annonces</h2>
//         {annonces.length === 0 ? (
//           <p className="text-gray-500">Vous n’avez publié aucune annonce.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {annonces.map((ann) => (
//               <div key={ann.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
//                 <img src={ann.image} alt={ann.titre} className="w-full h-40 object-cover" />
//                 <div className="p-4 flex justify-between items-center">
//                   <div>
//                     <h3 className="font-semibold">{ann.titre}</h3>
//                     <p className="text-blue-600 font-bold">{ann.prix} USD</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button onClick={() => ouvrirModaleAnnonce(ann)} className="text-yellow-600 hover:text-yellow-800"><FaEdit /></button>
//                     <button onClick={() => supprimerAnnonce(ann.id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
//                     <button onClick={() => terminerAnnonce(ann.id)} className="text-green-600 hover:text-green-800">Terminer</button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Modale profil */}
//       {isProfileModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96 relative">
//             <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => setIsProfileModalOpen(false)}>✖</button>
//             <h2 className="text-xl font-bold mb-4">Modifier le profil</h2>
//             <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
//               <div className="flex justify-center mb-2">
//                 {previewAvatar ? (
//                   <img src={previewAvatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
//                 ) : (
//                   <FaUserCircle className="w-24 h-24 text-gray-400" />
//                 )}
//               </div>
//               <input type="file" accept="image/*" onChange={handleAvatarChange} />
//               <input type="text" name="nom" defaultValue={user.nom} className="border px-3 py-2 rounded" placeholder="Nom" required />
//               <input type="email" name="email" defaultValue={user.email} className="border px-3 py-2 rounded" placeholder="Email" required />
//               <input type="text" name="telephone" defaultValue={user.telephone} className="border px-3 py-2 rounded" placeholder="Téléphone" required />
//               <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enregistrer</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Modale édition annonce */}
//       {isAnnonceModalOpen && editAnnonce && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg p-6 w-96 relative">
//             <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => setIsAnnonceModalOpen(false)}>✖</button>
//             <h2 className="text-xl font-bold mb-4">Modifier l'annonce</h2>
//             <form onSubmit={handleSaveAnnonce} className="flex flex-col gap-4">
//               <div className="flex justify-center mb-2">
//                 {previewAnnonceImage && <img src={previewAnnonceImage} alt="Aperçu" className="w-24 h-24 object-cover" />}
//               </div>
//               <input type="file" accept="image/*" onChange={e => {
//                 const file = e.target.files[0];
//                 if (file) {
//                   const reader = new FileReader();
//                   reader.onload = () => setPreviewAnnonceImage(reader.result);
//                   reader.readAsDataURL(file);
//                 }
//               }} />
//               <input type="text" name="titre" defaultValue={editAnnonce.titre} className="border px-3 py-2 rounded" placeholder="Titre" required />
//               <input type="number" name="prix" defaultValue={editAnnonce.prix} className="border px-3 py-2 rounded" placeholder="Prix" required />
//               <input type="number" name="prix"  className="border px-3 py-2 rounded" placeholder="Telephone" required />
//               <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enregistrer</button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import React, { useState, useEffect } from "react";
import {
  FaUserCircle, FaEnvelope, FaPhone, FaEdit, FaTrash, FaChartPie,
  FaBars, FaHome, FaUser, FaCog, FaSignOutAlt
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../provider/useAuthStore";

export const ProfilePage = () => {
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);

  const [annonces, setAnnonces] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar);

  const [editAnnonce, setEditAnnonce] = useState(null);
  const [isAnnonceModalOpen, setIsAnnonceModalOpen] = useState(false);
  const [previewAnnonceImage, setPreviewAnnonceImage] = useState(null);

  const links = [
    { to: "/", icon: <FaHome />, label: "Accueil" },
    { to: "/profile", icon: <FaUser />, label: "Profil" },
    { to: "/settings", icon: <FaCog />, label: "Paramètres" },
  ];

  useEffect(() => {
    setPreviewAvatar(user?.avatar);
  }, [user?.avatar]);

  // Charger les annonces de l'utilisateur
  useEffect(() => {
    if (!token || !user?.id) return;

    const fetchAnnonces = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/ads?userId=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Impossible de récupérer les annonces");
        const data = await res.json();
        setAnnonces(data);
      } catch (err) {
        console.error(err);
        setAnnonces([]);
      }
    };

    fetchAnnonces();
  }, [token, user?.id]);

  const supprimerAnnonce = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/v1/ads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Impossible de supprimer l'annonce");
      setAnnonces(annonces.filter(ann => ann.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  const ouvrirModaleAnnonce = (ann) => {
    setEditAnnonce(ann);
    setPreviewAnnonceImage(ann.image);
    setIsAnnonceModalOpen(true);
  };

  const handleSaveAnnonce = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedAnnonce = {
      titre: formData.get("titre"),
      prix: formData.get("prix"),
      image: previewAnnonceImage,
    };
    try {
      const res = await fetch(`http://localhost:3000/api/v1/ads/${editAnnonce.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAnnonce),
      });
      if (!res.ok) throw new Error("Impossible de mettre à jour l'annonce");
      setAnnonces(annonces.map(ann => ann.id === editAnnonce.id ? { ...ann, ...updatedAnnonce } : ann));
      setIsAnnonceModalOpen(false);
      setEditAnnonce(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

const handleSaveProfile = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const updatedUser = {
    name: formData.get("nom"),
    email: formData.get("email"),
    phone: formData.get("telephone"),
    avatar: previewAvatar,
  };

  try {
    const res =
 await fetch(`http://localhost:3000/api/v1/users/${user.id}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(updatedUser),
});



    if (!res.ok) throw new Error("Impossible de mettre à jour le profil");

    const data = await res.json();

    // Met à jour l'état global (Zustand)
    useAuthStore.getState().setUser(data);

    // Met à jour localement pour afficher immédiatement
    setPreviewAvatar(data.avatar);
    setIsProfileModalOpen(false);
    alert("Profil mis à jour avec succès !");
  } catch (err) {
    console.error(err);
    alert("Erreur lors de la mise à jour du profil");
  }
};


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "w-64" : "w-16"} bg-blue-600 text-white min-h-screen transition-all duration-300 flex flex-col`}>
        <button className="p-4 text-xl focus:outline-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <FaBars />
        </button>
        <nav className="flex-1">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} className="flex items-center gap-3 px-4 py-2 hover:bg-blue-500">
              {link.icon} {isSidebarOpen && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>
        <button className="flex items-center gap-3 px-4 py-2 hover:bg-red-500">
          <FaSignOutAlt /> {isSidebarOpen && <span>Déconnexion</span>}
        </button>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex items-center gap-6">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <FaUserCircle className="w-24 h-24 text-gray-400" />
          )}
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="flex items-center gap-2 text-gray-600"><FaEnvelope /> {user?.email}</p>
            <p className="flex items-center gap-2 text-gray-600"><FaPhone /> {user?.phone}</p>
          </div>
          <button
            className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => { setPreviewAvatar(user?.avatar); setIsProfileModalOpen(true); }}
          >
            <FaEdit /> Modifier le profil
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
            <FaChartPie className="text-blue-600 text-3xl mb-2" />
            <p className="text-gray-600">Total annonces</p>
            <p className="text-xl font-bold">{annonces.length}</p>
          </div>
        </div>

        {/* Annonces */}
        <h2 className="text-xl font-semibold mb-4">Mes annonces</h2>
        {annonces.length === 0 ? (
          <p className="text-gray-500">Vous n’avez publié aucune annonce.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map(ann => (
              <div key={ann.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
                <img src={ann.image} alt={ann.titre} className="w-full h-40 object-cover" />
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{ann.titre}</h3>
                    <p className="text-blue-600 font-bold">{ann.prix} USD</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => ouvrirModaleAnnonce(ann)} className="text-yellow-600 hover:text-yellow-800"><FaEdit /></button>
                    <button onClick={() => supprimerAnnonce(ann.id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modale profil */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => setIsProfileModalOpen(false)}>✖</button>
            <h2 className="text-xl font-bold mb-4">Modifier le profil</h2>
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div className="flex justify-center mb-2">
                {previewAvatar ? (
                  <img src={previewAvatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <FaUserCircle className="w-24 h-24 text-gray-400" />
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
              <input type="text" name="nom" defaultValue={user?.name} className="border px-3 py-2 rounded" placeholder="Nom" required />
              <input type="email" name="email" defaultValue={user?.email} className="border px-3 py-2 rounded" placeholder="Email" required />
              <input type="text" name="telephone" defaultValue={user?.phone} className="border px-3 py-2 rounded" placeholder="Téléphone" required />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enregistrer</button>
            </form>
          </div>
        </div>
      )}

      {/* Modale édition annonce */}
      {isAnnonceModalOpen && editAnnonce && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={() => setIsAnnonceModalOpen(false)}>✖</button>
            <h2 className="text-xl font-bold mb-4">Modifier l'annonce</h2>
            <form onSubmit={handleSaveAnnonce} className="flex flex-col gap-4">
              <div className="flex justify-center mb-2">
                {previewAnnonceImage && <img src={previewAnnonceImage} alt="Aperçu" className="w-24 h-24 object-cover" />}
              </div>
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => setPreviewAnnonceImage(reader.result);
                  reader.readAsDataURL(file);
                }
              }} />
              <input type="text" name="titre" defaultValue={editAnnonce.titre} className="border px-3 py-2 rounded" placeholder="Titre" required />
              <input type="number" name="prix" defaultValue={editAnnonce.prix} className="border px-3 py-2 rounded" placeholder="Prix" required />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

