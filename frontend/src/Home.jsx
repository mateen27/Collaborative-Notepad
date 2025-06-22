import React from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

function Home() {
  const navigate = useNavigate();

  const createRoom = () => {
    const roomId = nanoid(10);
    const password = prompt("🔐 Set a password for your new room (optional):") || "";
    navigate(`/room/${roomId}?password=${encodeURIComponent(password)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 text-center px-4 py-12">
      <div>
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 drop-shadow-lg animate-fade-in">
          📝 Real-Time Notepad
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          <strong>🔒 We don’t store any of your data. Everything is live and private.</strong><br />
          Create a private room, invite your friend, and write together in real time.
          No login, no hassle — just share the link.
        </p>
        <button
          onClick={createRoom}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg font-medium py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105"
        >
          🚀 Create Private Room
        </button>
      </div>

      <div className="text-sm text-gray-500 mt-12">
        Made with ❤️ by Mohd Mateen Khan
      </div>
    </div>
  );
}

export default Home;
