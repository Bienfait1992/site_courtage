import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const EmailVerification = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get("token");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/users/verify-email?token=${token}`,
          { method: "GET" }
        );
        const data = await response.json();
        if (response.ok) {
          setMessage("Votre e-mail a été vérifié avec succès !");
        } else {
          setMessage(data.message || "Erreur lors de la vérification");
        }
      } catch (err) {
        setMessage("Erreur serveur, veuillez réessayer");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return <div>{message}</div>;
};
