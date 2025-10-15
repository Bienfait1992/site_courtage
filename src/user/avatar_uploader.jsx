// import React, { useState } from "react";
// import { useAuthStore } from "../provider/useAuthStore";

// export const AvatarUploader = () => {
//   const [file, setFile] = useState(null);
//   const user = useAuthStore((state) => state.user);
//   const setUser = useAuthStore((state) => state.setUser);
//   const token = useAuthStore((state) => state.token);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("Choisis une image !");
//     const formData = new FormData();
//     formData.append("avatar", file);

//     try {
//       const res = await fetch(`http://localhost:3000/user/avatar/${user.id}`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Erreur upload");

//       const updatedUser = await res.json();
//       setUser(updatedUser); // mettre à jour Zustand avec le nouvel avatar
//       setFile(null);
//     } catch (err) {
//       console.error(err);
//       alert("Erreur upload avatar");
//     }
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <input type="file" accept="image/*" onChange={handleFileChange} />
//       <button
//         onClick={handleUpload}
//         className="px-3 py-1 bg-blue-500 text-white rounded"
//       >
//         Upload
//       </button>
//     </div>
//   );
// };


import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../provider/useAuthStore";

export const DropdownAvatarUploader = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(""); // pour afficher l'erreur backend
  const dropdownRef = useRef(null);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const token = useAuthStore((state) => state.token);

  const handleFileChange = (e) => {
    setError("");
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
      setError("Fichier trop volumineux (max 2MB)");
      return;
    }
    setFile(selectedFile);
  };


const handleUpload = async () => {
  setError("");
  console.log("Début upload avatar...");

  if (!user?.id) {
    setError("Utilisateur non défini");
    console.warn("Erreur: utilisateur non défini");
    return;
  }

  if (!file) {
    setError("Veuillez sélectionner un fichier avant d’uploader");
    console.warn("Erreur: fichier non sélectionné");
    return;
  }

  setLoading(true);

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    console.log("FormData préparé :", formData.get("avatar"));

    const res = await fetch(`http://localhost:3000/user/avatar/${user.id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    console.log("Status HTTP :", res.status);
    
    const data = await res.json().catch((e) => {
      console.error("Impossible de parser JSON :", e);
      return null;
    });

    console.log("Réponse du serveur :", data);

    if (!res.ok) {
      setError(data?.message || `Erreur upload avatar (HTTP ${res.status})`);
      console.error("Erreur serveur :", data);
      return;
    }

    // Mise à jour du store utilisateur
    console.log("Upload réussi, mise à jour du store utilisateur...");
    setUser(data);
    setFile(null);
    setOpen(false);

  } catch (err) {
    console.error("Erreur réseau ou fetch :", err);
    setError("Erreur serveur lors de l'upload");
  } finally {
    setLoading(false);
    console.log("Upload terminé.");
  }
};


  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-gray-400"
        onClick={() => setOpen((prev) => !prev)}
      >
        {user?.avatarUrl ? (
          <img
            src={`http://localhost:3000${user.avatarUrl}`}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-bold">{user?.name?.charAt(0) || "U"}</span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded border p-3 flex flex-col items-center z-50">
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2 text-gray-500">
              Preview
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2"
          />

          {error && (
            <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className={`w-full px-3 py-1 rounded text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      )}
    </div>
  );
};
