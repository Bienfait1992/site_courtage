import { useEffect } from "react";
import { useAuthStore } from "../provider/useAuthStore";

export default function AuthInitializer() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Impossible de récupérer l'utilisateur");
        const userData = await res.json();
        setUser(userData); // stocke tout l'utilisateur, y compris avatar
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [token, setUser]);

  return null;
}
