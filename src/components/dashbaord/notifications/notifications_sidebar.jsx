import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../../../provider/useAuthStore";

const API_URL = "http://localhost:3000/api/v1/notifications";
const SOCKET_URL = "http://localhost:3000";

export const NotificationsSidebar = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const token = useAuthStore((state) => state.token);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
const data = await res.json();
setNotifications(Array.isArray(data) ? data : []);



    } catch (err) {
      console.error("Erreur fetch notifications:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_URL}/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Erreur markAsRead:", err);
    }
  };

  useEffect(() => {
    if (!token || !isOpen) return;

    fetchNotifications();

  const socket = io(SOCKET_URL, { auth: { token } });

  socket.on("new-notification", (notif) => {
  setNotifications((prev) => {
    const arrayPrev = Array.isArray(prev) ? prev : [];
    return [notif, ...arrayPrev];
  });
});


    return () => socket.disconnect();
  }, [token, isOpen]);

  if (!isOpen) return null;

const unreadCount = Array.isArray(notifications)
  ? notifications.filter((n) => !n.read).length
  : 0;


  return (
    <div className="fixed top-16 right-4 w-80 max-h-[80vh] overflow-y-auto bg-white border rounded shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Notifications</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">Aucune notification</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3 mb-2 rounded border ${
              n.read ? "bg-gray-100" : "bg-blue-100"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold">{n.title}</h4>
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                  Marquer lu
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};