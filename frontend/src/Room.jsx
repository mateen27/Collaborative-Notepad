import React, { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

function Room() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const [text, setText] = useState("");
  const [passwordSet, setPasswordSet] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const isTyping = useRef(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const passwordFromURL = searchParams.get("password") || "";
    const promptPassword = !passwordFromURL;
    const password = promptPassword ? prompt("🔐 Enter the room password (if any):") || "" : passwordFromURL;

    socketRef.current = io("https://collaborative-notepad-w2ft.onrender.com");

    socketRef.current.emit("join-room", { roomId, password });

    const handleAuthFailed = () => {
      alert("❌ Incorrect password. Redirecting to homepage...");
      window.location.href = "/";
    };

    const handleLoadText = (data) => {
      if (!isTyping.current) setText(data);
    };

    socketRef.current.on("auth-failed", handleAuthFailed);
    socketRef.current.on("load-text", handleLoadText);

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const handleChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    isTyping.current = true;
    socketRef.current.emit("update-text", newText);
    setTimeout(() => (isTyping.current = false), 500);
  };

  const handleSetPassword = () => {
    if (!passwordSet) {
      const newPass = prompt("🔐 Set a password for this room:");
      if (newPass) {
        socketRef.current.emit("set-password", { roomId, password: newPass });
        setPasswordSet(true);
        alert("✅ Password set!");
      }
    } else {
      alert("Password already set!");
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-300 via-purple-200 to-pink-200 text-gray-900"
      }`}
    >
            <header
        className={`${
          darkMode
            ? "bg-white/10 backdrop-blur-md border-white/20"
            : "bg-white/40 backdrop-blur-md border-white/40"
        } px-4 sm:px-6 py-4 flex justify-between items-center border-b shadow-sm`}
      >
        <h2 className="text-lg sm:text-2xl font-bold animate-fade-in">
          📝 Room: <span className="text-indigo-700 dark:text-indigo-300">{roomId}</span>
        </h2>
        <div className="flex gap-2 flex-wrap items-center">
          <button
            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1.5 sm:px-5 sm:py-2 rounded-full"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("✅ Link copied!");
            }}
          >
            📋 <span className="hidden sm:inline">Copy Link</span>
          </button>
          <button
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-3 py-1.5 sm:px-5 sm:py-2 rounded-full"
            onClick={() => {
              navigator.clipboard.writeText(text);
              alert("📄 Text copied to clipboard!");
            }}
          >
            📄 <span className="hidden sm:inline">Copy Text</span>
          </button>
          <button
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1.5 sm:px-5 sm:py-2 rounded-full"
            onClick={handleSetPassword}
          >
            🔐 <span className="hidden sm:inline">Set Password</span>
          </button>
          <button
            className="ml-2 text-sm px-2 py-1.5 sm:px-4 sm:py-2 border rounded-full shadow-inner"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "🌞" : "🌙"} <span className="hidden sm:inline">Mode</span>
          </button>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="max-w-5xl mx-auto">
          <textarea
            rows={20}
            value={text}
            onChange={handleChange}
            className={`w-full h-full p-6 text-lg resize-none rounded-2xl border shadow-xl focus:outline-none transition-all duration-300 ${
              darkMode
                ? "bg-white/10 text-white border-white/20"
                : "bg-white/40 text-gray-900 border-white/50"
            }`}
            placeholder="Start typing your notes here..."
          />
        </div>
      </main>

      <footer
        className={`text-center py-3 border-t shadow-inner rounded-t-xl ${
          darkMode
            ? "bg-white/10 text-gray-300 border-white/20"
            : "bg-white/30 text-gray-700 border-white/40"
        }`}
      >
        Made with ❤️ by Mohd Mateen Khan
      </footer>
    </div>
  );
}

export default Room;
