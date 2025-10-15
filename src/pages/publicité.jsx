import React, { useEffect, useState } from "react"; 
import { useAuthStore } from "../provider/useAuthStore";

export const PublicitePage = () => {
  const [publicites, setPublicites] = useState([]);
  const token = useAuthStore((state) => state.token); 

  useEffect(() => {
    const fetchPublicites = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/pubs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur lors de la récupération des pubs");
        const data = await res.json();
        setPublicites(data.pubs || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPublicites();
  }, [token]);

 return (
  <div className="flex flex-col gap-6">
    {publicites.map((pub) => (
      <div key={pub.id} className="flex flex-col gap-2">
        <a href={pub.sourceurl} target="_blank" rel="noopener noreferrer">
          <img
            src={pub.imageUrl}
            alt="Publicité"
            className="w-full h-[300px] object-cover rounded-lg shadow-md cursor-pointer"
          />
        </a>
      </div>
    ))}
  </div>
);

};

