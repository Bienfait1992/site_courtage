import { useState } from "react";
import { useAuthStore } from "../provider/useAuthStore";
import toast from "react-hot-toast";

export default function AvatarUpdater({ userId, token }) {
  const [loading, setLoading] = useState(false);
  const setAvatar = useAuthStore((state) => state.setAvatar);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Seules les images sont autorisées");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/v1/users/${userId}/avatar`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l'upload");

      const data = await res.json(); // { avatar: 'url' }
      setAvatar(data.avatar);       // Met à jour le store
      // toast.success("Avatar mis à jour !");
    } catch (err) {
      console.error(err);
      toast.error("Impossible de mettre à jour l'avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <label className="">
      {/* relative cursor-pointer */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={loading}
      />
      <div className="absolute w-8 h-8 top-11 left-13 bg-gray-500 bg-opacity-30 text-white flex items-center justify-center rounded-full hover:bg-opacity-50 transition">
        {loading ? "..." : "✎"}
      </div>
    </label>
  );
}
