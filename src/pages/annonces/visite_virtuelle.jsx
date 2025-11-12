// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";

// const SIGNALING_SERVER = process.env.REACT_APP_SIGNALING_SERVER || "http://localhost:5173";
// const API_SERVER = process.env.REACT_APP_API_SERVER || "http://localhost:5173";
// const socket = io(SIGNALING_SERVER, { autoConnect: false });

// export default function VisiteVirtuelleModal({ open, onClose, roomId, userType, userId, userName, visiteId }) {
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const pcRef = useRef(null);
//   const recorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState("");
//   const [isMuted, setIsMuted] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const [connected, setConnected] = useState(false);

//   useEffect(() => {
//     if (!open) return;
//     socket.connect();

//     let localStream;
//     const pc = new RTCPeerConnection({
//       iceServers: [
//         { urls: "stun:stun.l.google.com:19302" },
//         // TURN will be injected from env (see below example)
//         ...(process.env.REACT_APP_TURN_URL ? [{
//            urls: process.env.REACT_APP_TURN_URL,
//            username: process.env.REACT_APP_TURN_USERNAME,
//            credential: process.env.REACT_APP_TURN_CREDENTIAL
//         }] : [])
//       ]
//     });
//     pcRef.current = pc;

//     pc.ontrack = (e) => {
//       if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
//     };

//     pc.onicecandidate = (e) => {
//       if (e.candidate) socket.emit("signal", { roomId, data: { candidate: e.candidate } });
//     };

//     socket.emit("join-room", { roomId, userType, userId, userName });

//     socket.on("signal", async ({ from, data }) => {
//       try {
//         if (data.candidate) {
//           await pc.addIceCandidate(data.candidate);
//           return;
//         }
//         if (data.type === "offer") {
//           await pc.setRemoteDescription(new RTCSessionDescription(data));
//           const answer = await pc.createAnswer();
//           await pc.setLocalDescription(answer);
//           socket.emit("signal", { roomId, to: from, data: pc.localDescription });
//           return;
//         }
//         if (data.type === "answer") {
//           await pc.setRemoteDescription(new RTCSessionDescription(data));
//           return;
//         }
//       } catch (err) {
//         console.error("signal handling:", err);
//       }
//     });

//     socket.on("chat-message", (msg) => {
//       setChatMessages((s) => [...s, msg]);
//     });

//     const startLocal = async () => {
//       try {
//         localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
//         localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));
//       } catch (err) {
//         console.error("getUserMedia error:", err);
//       }
//     };

//     startLocal();

//     // agent starts negotiation
//     if (userType === "agent") {
//       pc.onnegotiationneeded = async () => {
//         try {
//           const offer = await pc.createOffer();
//           await pc.setLocalDescription(offer);
//           socket.emit("signal", { roomId, data: pc.localDescription });
//         } catch (err) {
//           console.error("negotiation error", err);
//         }
//       };
//     }

//     setConnected(true);

//     return () => {
//       setConnected(false);
//       if (localStream) localStream.getTracks().forEach(t => t.stop());
//       pc.close();
//       pcRef.current = null;
//       socket.emit("leave-room", { roomId });
//       socket.disconnect();
//       socket.off("signal");
//       socket.off("chat-message");
//     };
//   }, [open, roomId, userType, userId, userName]);

//   // send chat -> via socket and persist via REST
// const sendMessage = async () => {
//   if (!chatInput.trim()) return;

//   const payload = {
//     roomId,
//     text: chatInput,
//     visiteId
//   };

//   socket.emit("chat-message", payload);

//   setChatInput("");

//   if (visiteId) {
//     try {
//       const res = await fetch(`${API_SERVER}/api/visites/${visiteId}/messages`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": "Bearer " + token
//         },
//         body: JSON.stringify({ text: payload.text })
//       });

//       console.log("POST status", res.status);
//     } catch (err) {
//       console.error("persist message err", err);
//     }
//   }
// };

// // écoute du socket
// socket.on("chat-message", (msg) => {
//   setChatMessages((prev) => [...prev, msg]);
// });

// // rejoindre la room
// socket.emit("join-room", "visite-" + visiteId);


//   // media recorder
//   const startRecording = async () => {
//     if (!remoteVideoRef.current && !localVideoRef.current) return;
//     recordedChunksRef.current = [];
//     const stream = remoteVideoRef.current?.srcObject || localVideoRef.current?.srcObject;
//     if (!stream) return alert("Flux indisponible");
//     const options = { mimeType: "video/webm; codecs=vp9" };
//     const mediaRecorder = new MediaRecorder(stream, options);
//     recorderRef.current = mediaRecorder;
//     mediaRecorder.ondataavailable = (e) => {
//       if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
//     };
//     mediaRecorder.onstop = async () => {
//       const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
//       const form = new FormData();
//       form.append("file", blob, `visite_${visiteId || roomId}_${Date.now()}.webm`);
//       try {
//         const res = await fetch(`${API_SERVER}/api/visites/${visiteId}/recordings`, {
//           method: "POST",
//           body: form
//         });
//         if (!res.ok) console.error("Upload failed", await res.text());
//         else console.log("Upload OK");
//       } catch (err) {
//         console.error("upload error", err);
//       }
//       setRecording(false);
//     };
//     mediaRecorder.start();
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     const r = recorderRef.current;
//     if (r && r.state !== "inactive") r.stop();
//   };

//   const toggleMute = () => {
//     const pc = pcRef.current;
//     if (!pc) return;
//     const senders = pc.getSenders();
//     senders.forEach(s => {
//       if (s.track && s.track.kind === "audio") s.track.enabled = !s.track.enabled;
//     });
//     setIsMuted(!isMuted);
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg p-4 w-full max-w-5xl h-[85vh] overflow-hidden">
//         <div className="flex justify-between items-center mb-2">
//           <h3 className="font-semibold">Visite virtuelle</h3>
//           <div className="flex items-center gap-2">
//             <button onClick={toggleMute} className="px-3 py-1 bg-gray-200 rounded text-sm">
//               {isMuted ? "Réactiver" : "Muet"}
//             </button>
//             {!recording ? (
//               <button onClick={startRecording} className="px-3 py-1 bg-yellow-500 rounded text-sm">Enregistrer</button>
//             ) : (
//               <button onClick={stopRecording} className="px-3 py-1 bg-red-500 rounded text-sm">Arrêter</button>
//             )}
//             <button onClick={onClose} className="px-3 py-1 bg-gray-700 text-white rounded text-sm">Fermer</button>
//           </div>
//         </div>

//         <div className="flex gap-4 h-full">
//           <div className="flex-1 flex flex-col gap-2">
//             <div className="flex gap-2">
//               <div className="flex-1 border rounded overflow-hidden">
//                 <div className="text-xs p-2 bg-gray-100">Ma caméra</div>
//                 <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-[300px] object-cover" />
//               </div>
//               <div className="flex-1 border rounded overflow-hidden">
//                 <div className="text-xs p-2 bg-gray-100">Caméra distante</div>
//                 <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-[300px] object-cover" />
//               </div>
//             </div>

//             <div className="mt-2">
//               <p className="text-sm text-gray-600">Statut : {connected ? "Connecté" : "En attente"}</p>
//             </div>
//           </div>

//           <div className="w-80 border-l pl-3 flex flex-col">
//             <div className="flex-1 overflow-auto mb-2">
//               {chatMessages.map((m, i) => (
//                 <div key={i} className="mb-2">
//                   <div className="text-xs text-gray-500">{m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : ""} - {m.senderName}</div>
//                   <div className="bg-gray-100 rounded p-2 mt-1 text-sm">{m.text}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-auto">
//               <textarea rows={3} value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="Écrire un message..." />
//               <div className="flex justify-between items-center mt-2">
//                 <button onClick={sendMessage} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Envoyer</button>
//                 <span className="text-xs text-gray-400">visite: {visiteId || roomId}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useAuthStore } from "../../provider/useAuthStore";

const SIGNALING_SERVER = import.meta.env.VITE_SIGNALING_SERVER || "http://localhost:5173";
const API_SERVER = import.meta.env.VITE_API_SERVER || "http://localhost:5173";

const socket = io(SIGNALING_SERVER, { autoConnect: false });

export default function VisiteVirtuelleModal({ open, onClose, roomId, userType, userId, userName, visiteId }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pcRef = useRef(null);
  const recorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [connected, setConnected] = useState(false);

  const { token } = useAuthStore();   // <- récupération token

  useEffect(() => {
    if (!open) return;

    socket.connect();

    let localStream;
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        ...(process.env.REACT_APP_TURN_URL
          ? [{
              urls: process.env.REACT_APP_TURN_URL,
              username: process.env.REACT_APP_TURN_USERNAME,
              credential: process.env.REACT_APP_TURN_CREDENTIAL
            }]
          : [])
      ]
    });
    pcRef.current = pc;

    pc.ontrack = (e) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("signal", { roomId, data: { candidate: e.candidate } });
      }
    };

    // rejoindre une room WebRTC
    socket.emit("join-room", { roomId, userType, userId, userName });

    // rejoindre la room spécifique du chat
    if (visiteId) {
      socket.emit("join-room", "visite-" + visiteId);
    }

    socket.on("signal", async ({ from, data }) => {
      try {
        if (data.candidate) {
          await pc.addIceCandidate(data.candidate);
          return;
        }
        if (data.type === "offer") {
          await pc.setRemoteDescription(new RTCSessionDescription(data));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("signal", { roomId, to: from, data: pc.localDescription });
          return;
        }
        if (data.type === "answer") {
          await pc.setRemoteDescription(new RTCSessionDescription(data));
          return;
        }
      } catch (err) {
        console.error("signal handling:", err);
      }
    });

    // écouter les messages du chat
    socket.on("chat-message", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    const startLocal = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
        localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));
      } catch (err) {
        console.error("getUserMedia error:", err);
      }
    };

    startLocal();

    // un agent initie l'offre
    if (userType === "agent") {
      pc.onnegotiationneeded = async () => {
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("signal", { roomId, data: pc.localDescription });
        } catch (err) {
          console.error("negotiation error", err);
        }
      };
    }

    setConnected(true);

    return () => {
      setConnected(false);
      if (localStream) localStream.getTracks().forEach((t) => t.stop());
      pc.close();
      pcRef.current = null;

      socket.emit("leave-room", { roomId });
      if (visiteId) socket.emit("leave-room", "visite-" + visiteId);

      socket.off("signal");
      socket.off("chat-message");
      socket.disconnect();
    };
  }, [open, roomId, userType, userId, userName, visiteId]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const payload = {
    roomId: "visite-" + visiteId, // utiliser la même room côté serveur
    text: chatInput,
    visiteId,
    senderId: userId,
    senderName: userName
    };


    socket.emit("chat-message", payload);
    setChatInput("");

    if (visiteId) {
      try {
        const res = await fetch(`${API_SERVER}/api/visites/${visiteId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({
            text: payload.text,
            senderId: payload.senderId,
            senderName: payload.senderName
          })
        });

        console.log("POST status", res.status);
      } catch (err) {
        console.error("persist message err", err);
      }
    }
  };

  const startRecording = async () => {
    if (!remoteVideoRef.current && !localVideoRef.current) return;
    recordedChunksRef.current = [];

    const stream = remoteVideoRef.current?.srcObject || localVideoRef.current?.srcObject;
    if (!stream) return alert("Flux indisponible");

    const options = { mimeType: "video/webm; codecs=vp9" };
    const mediaRecorder = new MediaRecorder(stream, options);
    recorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const form = new FormData();
      form.append("file", blob, `visite_${visiteId || roomId}_${Date.now()}.webm`);

      try {
        const res = await fetch(`${API_SERVER}/api/visites/${visiteId}/recordings`, {
          method: "POST",
          body: form
        });
        if (!res.ok) console.error("Upload failed", await res.text());
        else console.log("Upload OK");
      } catch (err) {
        console.error("upload error", err);
      }

      setRecording(false);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    const r = recorderRef.current;
    if (r && r.state !== "inactive") r.stop();
  };

  const toggleMute = () => {
    const pc = pcRef.current;
    if (!pc) return;

    pc.getSenders().forEach((sender) => {
      if (sender.track && sender.track.kind === "audio") {
        sender.track.enabled = !sender.track.enabled;
      }
    });

    setIsMuted(!isMuted);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-5xl h-[85vh] overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Visite virtuelle</h3>

          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="px-3 py-1 bg-gray-200 rounded text-sm">
              {isMuted ? "Réactiver" : "Muet"}
            </button>

            {!recording ? (
              <button onClick={startRecording} className="px-3 py-1 bg-yellow-500 rounded text-sm">
                Enregistrer
              </button>
            ) : (
              <button onClick={stopRecording} className="px-3 py-1 bg-red-500 rounded text-sm">
                Arrêter
              </button>
            )}

            <button onClick={onClose} className="px-3 py-1 bg-gray-700 text-white rounded text-sm">
              Fermer
            </button>
          </div>
        </div>

        <div className="flex gap-4 h-full">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex-1 border rounded overflow-hidden">
                <div className="text-xs p-2 bg-gray-100">Ma caméra</div>
                <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-[300px] object-cover" />
              </div>

              <div className="flex-1 border rounded overflow-hidden">
                <div className="text-xs p-2 bg-gray-100">Caméra distante</div>
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-[300px] object-cover" />
              </div>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Statut : {connected ? "Connecté" : "En attente"}
              </p>
            </div>
          </div>

          <div className="w-80 border-l pl-3 flex flex-col">
            <div className="flex-1 overflow-auto mb-2">
              {chatMessages.map((m, i) => (
                <div key={i} className="mb-2">
                  <div className="text-xs text-gray-500">
                    {m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : ""} - {m.senderName}
                  </div>
                  <div className="bg-gray-100 rounded p-2 mt-1 text-sm">{m.text}</div>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <textarea
                rows={3}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full border rounded p-2 text-sm"
                placeholder="Écrire un message..."
              />
              <div className="flex justify-between items-center mt-2">
                <button onClick={sendMessage} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                  Envoyer
                </button>
                <span className="text-xs text-gray-400">
                  visite: {visiteId || roomId}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
