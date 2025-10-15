import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../stores/authStore"; // ajuste le chemin selon ton projet

const API_URL = "http://ton-api.com/notifications"; // ← ton endpoint réel
const SOCKET_URL = "http://ton-api.com"; // ← URL de ton serveur Socket.IO

// Composant NotificationCard
const NotificationCard = ({ notification, onMarkRead }) => (
  <div className={`p-3 mb-2 rounded border ${notification.read ? "bg-gray-100" : "bg-blue-100"}`}>
    <div className="flex justify-between items-center">
      <div>
        <h4 className="font-semibold">{notification.title}</h4>
        <p className="text-sm">{notification.message}</p>
        <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
      </div>
      {!notification.read && (
        <button
          onClick={() => onMarkRead(notification.id)}
          className="ml-4 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
        >
          Marquer lu
        </button>
      )}
    </div>
  </div>
);

const NotificationsSidebar = () => {
  const [notifications, setNotifications] = useState([]);
  const token = useAuthStore((state) => state.token); // récupère le token depuis le store

  // Fetch notifications initiales
  const fetchNotifications = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Erreur fetch notifications");
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Erreur fetch notifications:", error);
    }
  };

  // Marquer notification comme lue
  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/read`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      if (!res.ok) throw new Error("Erreur markAsRead");
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Erreur markAsRead:", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchNotifications();

    // Connexion WebSocket
    const socket = io(SOCKET_URL, { auth: { token } });

    socket.on("new-notification", (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
    });

    return () => socket.disconnect();
  }, [token]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed top-16 right-4 w-80 max-h-[80vh] overflow-y-auto bg-white border rounded shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Notifications</h3>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucune notification.</p>
      ) : (
        notifications.map(n => (
          <NotificationCard key={n.id} notification={n} onMarkRead={markAsRead} />
        ))
      )}
    </div>
  );
};

export default NotificationsSidebar;
