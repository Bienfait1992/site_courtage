// export default ChatPage;

import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../provider/useAuthStore";
import Picker from "emoji-picker-react";

const ChatPage = ({ conversation }) => {
  const token = useAuthStore((state) => state.token);

  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [someoneTyping, setSomeoneTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [participants, setParticipants] = useState({}); // id => {stream, pc}

  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const [typing, setTyping] = useState(false);
  const emojiPickerRef = useRef(null);

  // ---------------------- Socket.IO ----------------------
  useEffect(() => {
    if (!token) return;
    const s = io("http://localhost:3000", { auth: { token }, transports: ["websocket"] });
    setSocket(s);

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));

    s.on("new_message", (msg) => setMessages(prev => [...prev, msg]));
    s.on("load_messages", (msgs) => setMessages(msgs));

    s.on("typing", (data) => {
      if (data.userId !== s.user?.id) setSomeoneTyping(true);
    });
    s.on("stop_typing", () => setSomeoneTyping(false));

    // WebRTC signaling
    s.on("webrtc_offer", async ({ offer, from }) => {
      const pc = new RTCPeerConnection();
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

      pc.ontrack = (event) => {
        setParticipants(prev => ({ ...prev, [from]: { ...prev[from], stream: event.stream } }));
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) s.emit("webrtc_ice_candidate", { candidate: event.candidate, to: from });
      };

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      s.emit("webrtc_answer", { answer, to: from });

      setParticipants(prev => ({ ...prev, [from]: { pc, stream: localStream } }));
    });

    s.on("webrtc_answer", async ({ answer, from }) => {
      if (participants[from]?.pc) await participants[from].pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    s.on("webrtc_ice_candidate", async ({ candidate, from }) => {
      if (participants[from]?.pc) await participants[from].pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => s.disconnect();
  }, [token, participants]);

  // ---------------------- Join conversation ----------------------
  useEffect(() => {
    if (socket && connected && conversation?.id) {
      socket.emit("join_conversation", conversation.id);
    }
  }, [socket, connected, conversation]);

  // ---------------------- Send message ----------------------
  const sendMessage = () => {
    if (!socket || !connected || !conversation?.id || !newMessage.trim()) return;
    socket.emit("send_message", { conversationId: conversation.id, content: newMessage });
    setNewMessage("");
    setTyping(false);
    socket.emit("stop_typing", { conversationId: conversation.id });
  };

  // ---------------------- Typing handler ----------------------
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socket) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", { conversationId: conversation.id });
    }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTyping(false);
      socket.emit("stop_typing", { conversationId: conversation.id });
    }, 1000);
  };

  // ---------------------- Emoji handler ----------------------
  const onEmojiClick = (emojiObject) => setNewMessage(prev => prev + emojiObject.emoji);

  // ---------------------- Click outside emoji picker ----------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) setShowEmojiPicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------------- Scroll auto ----------------------
  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, someoneTyping]);

  // ---------------------- Start Call ----------------------
  const startCall = async (video = true) => {
    const localStream = await navigator.mediaDevices.getUserMedia({ video, audio: true });
    const pc = new RTCPeerConnection();
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.ontrack = (event) => {
      setParticipants(prev => ({ ...prev, [Date.now()]: { stream: event.stream, pc } }));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) socket.emit("webrtc_ice_candidate", { candidate: event.candidate, conversationId: conversation.id });
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("webrtc_offer", { offer, conversationId: conversation.id, from: socket.id });

    setParticipants(prev => ({ ...prev, me: { pc, stream: localStream } }));
  };

  return (
    <div className="flex h-full w-full gap-4">
      {/* Chat Left */}
      <div className="flex flex-col flex-1 bg-gray-100 rounded-lg p-4">
        <div className="flex-1 overflow-y-auto mb-2 flex flex-col gap-1">
          {messages.map((msg, i) => {
            const isMine = msg.senderId === conversation?.buyerId;
            return (
              <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`relative max-w-[70%] px-4 py-2 rounded-2xl break-words ${isMine ? "bg-blue-500 text-white" : "bg-white text-black"}`}>
                  {msg.content}
                  <div className="text-right text-xs text-gray-300 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })}
          {someoneTyping && <div className="text-sm italic text-gray-500 ml-2 mb-1">en train d'écrire...</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input + Emoji */}
        <div className="flex flex-col gap-2 relative">
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-16 left-0 z-50">
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}
          <div className="flex gap-2 items-center">
            <button onClick={() => setShowEmojiPicker(prev => !prev)} className="px-2 py-1 bg-gray-200 rounded">😀</button>
            <input type="text" value={newMessage} onChange={handleTyping} onKeyDown={e => e.key === "Enter" && sendMessage()} className="flex-1 p-2 border rounded" placeholder="Écris un message..." />
            <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">Envoyer</button>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => startCall(true)} className="bg-green-600 text-white px-4 py-2 rounded">Appel Vidéo</button>
            <button onClick={() => startCall(false)} className="bg-yellow-600 text-white px-4 py-2 rounded">Appel Audio</button>
          </div>
        </div>
      </div>

      {/* Video Right */}
      <div className="flex flex-col w-80 gap-2">
        {Object.entries(participants).map(([id, p]) => p.stream && (
          <video key={id} autoPlay playsInline ref={el => el && (el.srcObject = p.stream)} className="w-full h-32 rounded" />
        ))}
      </div>
    </div>
  );
};

export default ChatPage;









// src/pages/chat_page.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import { useAuthStore } from "../provider/useAuthStore";
// import Picker from "emoji-picker-react";
// import { v4 as uuidv4 } from "uuid";

// const ChatPage = ({ conversation }) => {
//   const token = useAuthStore((s) => s.token);
//   const user = useAuthStore((s) => s.user);

//   const socketRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const dropRef = useRef(null);

//   const [connected, setConnected] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [typing, setTyping] = useState(false);
//   const typingTimeout = useRef(null);
//   const [someoneTyping, setSomeoneTyping] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [dragActive, setDragActive] = useState(false);

//   // ---------------------- Socket.IO init ----------------------
//   useEffect(() => {
//     if (!token) {
//       console.warn("Aucun token -> socket non initialisé");
//       return;
//     }

//     console.log("Initialisation Socket.IO...");
//     const s = io("http://localhost:3000", {
//       auth: { token },
//       transports: ["websocket"],
//     });

//     socketRef.current = s;

//     s.on("connect", () => {
//       console.log("Socket connecté:", s.id);
//       setConnected(true);
//     });

//     s.on("disconnect", (reason) => {
//       console.warn("Socket déconnecté:", reason);
//       setConnected(false);
//     });

//     s.on("connect_error", (err) => {
//       console.error("Connect error:", err.message);
//     });

//     s.on("error", (err) => {
//       console.error("Socket error:", err);
//     });

//     // messages historiques envoyés par le serveur
//     s.on("load_messages", (msgs) => {
//       console.log("load_messages reçu", msgs.length);
//       setMessages(msgs);
//     });

//     // nouveau message (texte ou fichier)
//     s.on("new_message", (msg) => {
//       console.log("new_message reçu:", msg);

//       // si le serveur renvoie clientId, remplace le message optimiste
//       if (msg.clientId) {
//         setMessages((prev) =>
//           prev.map((m) => (m.clientId === msg.clientId ? { ...msg, uploading: false } : m))
//         );
//       } else {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     // typing events
//     s.on("typing", (data) => {
//       if (data.userId !== user?.id) setSomeoneTyping(true);
//     });
//     s.on("stop_typing", (data) => {
//       if (data.userId !== user?.id) setSomeoneTyping(false);
//     });

//     return () => {
//       console.log("Déconnexion socket (cleanup)");
//       s.disconnect();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   // ---------------------- Join conversation ----------------------
//   useEffect(() => {
//     if (!socketRef.current || !connected || !conversation?.id) return;
//     console.log("Rejoindre conversation via socket:", conversation.id);
//     socketRef.current.emit("join_conversation", conversation.id);
//   }, [conversation, connected]);

//   // ---------------------- Scroll auto ----------------------
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, someoneTyping]);

//   // ---------------------- Typing handling ----------------------
//   const handleTyping = (e) => {
//     setNewMessage(e.target.value);
//     if (!socketRef.current) return;

//     if (!typing) {
//       setTyping(true);
//       socketRef.current.emit("typing", { conversationId: conversation.id, userId: user?.id });
//     }

//     clearTimeout(typingTimeout.current);
//     typingTimeout.current = setTimeout(() => {
//       setTyping(false);
//       socketRef.current.emit("stop_typing", { conversationId: conversation.id, userId: user?.id });
//     }, 900);
//   };

//   // ---------------------- Send text message ----------------------
//   const sendMessage = () => {
//     if (!newMessage.trim() || !socketRef.current || !conversation?.id) return;

//     const payload = {
//       conversationId: conversation.id,
//       content: newMessage.trim(),
//     };

//     console.log("Envoi message texte:", payload);
//     socketRef.current.emit("send_message", payload);
//     setNewMessage("");
//     setTyping(false);
//     socketRef.current.emit("stop_typing", { conversationId: conversation.id, userId: user?.id });
//   };

//   // ---------------------- Emoji ----------------------
//   const onEmojiClick = (emojiObj) => {
//     setNewMessage((prev) => prev + emojiObj.emoji);
//     setShowEmojiPicker(false);
//   };

//   // ---------------------- Files: drag & drop & input ----------------------
//   const handleFiles = (fileList) => {
//     const files = Array.from(fileList);
//     files.forEach((file) => {
//       const clientId = uuidv4(); // identifiant temporaire côté client

//       // create optimistic message object
//       const optimistic = {
//         clientId,
//         id: `temp-${clientId}`,
//         conversationId: conversation.id,
//         senderId: user?.id,
//         content: null,
//         fileName: file.name,
//         fileType: file.type,
//         fileData: null, // preview
//         createdAt: new Date().toISOString(),
//         uploading: true,
//       };

//       // show optimistic preview
//       if (file.type.startsWith("image/")) {
//         const reader = new FileReader();
//         reader.onload = () => {
//           optimistic.fileData = reader.result;
//           setMessages((prev) => [...prev, optimistic]);
//           // send base64 to server
//           socketRef.current?.emit("send_file", {
//             conversationId: conversation.id,
//             fileName: file.name,
//             fileType: file.type,
//             fileData: reader.result, // base64 data URL
//             clientId,
//           });
//           console.log("send_file émis (image) clientId:", clientId, file.name);
//         };
//         reader.readAsDataURL(file);
//       } else {
//         // non-image files: read as base64 anyway
//         const reader = new FileReader();
//         reader.onload = () => {
//           optimistic.fileData = null; // don't embed big base64 in DOM for non-images
//           setMessages((prev) => [...prev, optimistic]);
//           socketRef.current?.emit("send_file", {
//             conversationId: conversation.id,
//             fileName: file.name,
//             fileType: file.type,
//             fileData: reader.result,
//             clientId,
//           });
//           console.log("send_file émis (file) clientId:", clientId, file.name);
//         };
//         reader.readAsDataURL(file);
//       }
//     });
//   };

//   const onFileInputChange = (e) => {
//     if (!e.target.files || e.target.files.length === 0) return;
//     handleFiles(e.target.files);
//     e.target.value = null; // reset
//   };

//   // Drag events
//   useEffect(() => {
//     const el = dropRef.current;
//     if (!el) return;

//     const handleDragOver = (e) => {
//       e.preventDefault();
//       e.dataTransfer.dropEffect = "copy";
//       setDragActive(true);
//     };
//     const handleDragLeave = (e) => {
//       e.preventDefault();
//       setDragActive(false);
//     };
//     const handleDrop = (e) => {
//       e.preventDefault();
//       setDragActive(false);
//       if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//         handleFiles(e.dataTransfer.files);
//         e.dataTransfer.clearData();
//       }
//     };

//     el.addEventListener("dragover", handleDragOver);
//     el.addEventListener("dragleave", handleDragLeave);
//     el.addEventListener("drop", handleDrop);

//     return () => {
//       el.removeEventListener("dragover", handleDragOver);
//       el.removeEventListener("dragleave", handleDragLeave);
//       el.removeEventListener("drop", handleDrop);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [dropRef.current, socketRef.current, conversation]);

//   // ---------------------- Render helper for messages ----------------------
//   const renderMessage = (msg) => {
//     const isMine = msg.senderId === user?.id;
//     const containerClass = isMine ? "justify-end" : "justify-start";
//     const bubbleClass = isMine
//       ? "bg-blue-500 text-white rounded-br-none"
//       : "bg-white text-black rounded-bl-none";

//     return (
//       <div key={msg.id || msg.clientId} className={`flex ${containerClass} mb-2`}>
//         <div className={`relative max-w-[75%] px-4 py-2 rounded-2xl break-words ${bubbleClass}`}>
//           {/* Text message */}
//           {msg.content && <div className="whitespace-pre-wrap">{msg.content}</div>}

//           {/* Image preview */}
//           {msg.fileType && msg.fileType.startsWith("image/") && (msg.fileData || msg.fileUrl) && (
//             <div className="mt-2">
//               <img
//                 src={msg.fileData || msg.fileUrl}
//                 alt={msg.fileName}
//                 className="max-w-full max-h-60 rounded"
//               />
//               <div className="text-xs text-gray-200 mt-1">{msg.fileName}</div>
//             </div>
//           )}

//           {/* Non-image file */}
//           {msg.fileType && !msg.fileType.startsWith("image/") && (
//             <div className="mt-2 flex items-center gap-2">
//               <div className="p-2 border rounded bg-gray-50 text-sm">{msg.fileName}</div>
//               {/* if server returns fileUrl use <a href=...> */}
//               {msg.fileUrl ? (
//                 <a href={msg.fileUrl} download={msg.fileName} className="text-sm text-white underline">
//                   Télécharger
//                 </a>
//               ) : (
//                 <span className="text-xs text-gray-200">En attente d'upload...</span>
//               )}
//             </div>
//           )}

//           {/* uploading indicator */}
//           {msg.uploading && (
//             <div className="text-xs text-gray-200 mt-1 italic">Envoi en cours...</div>
//           )}

//           {/* time */}
//           <div className="text-right text-xs text-gray-200 mt-1">
//             {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ---------------------- UI ----------------------
//   return (
//     <div className="flex flex-col h-full bg-gray-100 rounded-lg p-4">
//       {/* Drag drop hint */}
//       <div
//         ref={dropRef}
//         className={`border-2 ${dragActive ? "border-dashed border-blue-400 bg-blue-50" : "border-transparent"} rounded p-2 mb-2 transition`}
//       >
//         <div className="flex justify-between items-center">
//           <div className="text-sm text-gray-600">Glisse & dépose des fichiers ici, ou clique sur 📎</div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
//             >
//               📎 Joindre
//             </button>
//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               className="hidden"
//               onChange={onFileInputChange}
//             />
//             <button
//               onClick={() => setShowEmojiPicker((s) => !s)}
//               className="px-3 py-1 bg-gray-200 rounded"
//             >
//               😀
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Messages feed */}
//       <div className="flex-1 overflow-y-auto mb-2 px-1">
//         {messages.map((m) => renderMessage(m))}
//         {someoneTyping && <div className="text-sm italic text-gray-500 ml-2 mb-1">en train d'écrire...</div>}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Emoji picker */}
//       {showEmojiPicker && (
//         <div className="mb-2">
//           <Picker onEmojiClick={onEmojiClick} />
//         </div>
//       )}

//       {/* Input area */}
//       <div className="flex items-center gap-2">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={handleTyping}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Écris un message..."
//           className="flex-1 p-2 border rounded"
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Envoyer
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
