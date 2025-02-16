import { useEffect, useState } from "react";
import axios from "axios";

export function ShowWinner({
  winner,
  yourscore,
  opponentscore,
  yourname,
  opponentname,
}) {
  const [you, setYou] = useState(null); // Your profile
  const [opponent, setOpponent] = useState(null); // Opponent's profile

  useEffect(() => {
    const getUserProfile = async (username, setUser) => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/search/username/${username}`
        );
        if (res.status === 200) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error(`Error fetching ${username}'s profile:`, error);
      }
    };
    getUserProfile(yourname, setYou);
    getUserProfile(opponentname, setOpponent);
  }, [yourname, opponentname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-8 bg-gradient-to-br from-green-700 to-indigo-900 animate-fade-in">

      {you && opponent ? (
        <>
          {/* Winner Section */}
          <div className="flex flex-col items-center mb-8 bg-green-400 p-6 rounded-xl shadow-lg shadow-green-500/50 animate-pulse">
            {winner!=="null" ? (
              <>
                <img
                  src={
                    winner === yourname
                      ? you.avatar || "https://via.placeholder.com/150"
                      : opponent.avatar || "https://via.placeholder.com/150"
                  }
                  alt={`${winner}'s avatar`}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
                />
                <h2 className="text-5xl font-extrabold text-white drop-shadow-md animate-bounce mt-4">
                  🎉 {winner} 🎉
                </h2>
                <p className="text-2xl text-gray-800 mt-2 italic">
                  is the winner!
                </p>
              </>
            ) : (
              <h2 className="text-3xl font-extrabold text-white">
                🤝 Game Draw 🤝
              </h2>
            )}
          </div>

          {/* Profiles Section */}
          <div className="flex justify-between w-full space-x-4">
            {/* Your Profile Section */}
            <div className="flex flex-col items-center w-1/2 p-4 bg-indigo-800 rounded-xl shadow-lg">
              <img
                src={you.avatar || "https://via.placeholder.com/150"}
                alt={`${you.username}'s avatar`}
                className="w-24 h-24 rounded-full border-4 border-white shadow-xl"
              />
              <h3 className="text-2xl font-bold text-yellow-400 mt-2">
                {you.username}
              </h3>
              <p className="text-lg text-white mt-2">Your Score: {yourscore}</p>
            </div>

            {/* Opponent Profile Section */}
            <div className="flex flex-col items-center w-1/2 p-4 bg-indigo-800 rounded-xl shadow-lg">
              <img
                src={opponent.avatar || "https://via.placeholder.com/150"}
                alt={`${opponent.username}'s avatar`}
                className="w-24 h-24 rounded-full border-4 border-white shadow-xl"
              />
              <h3 className="text-2xl font-bold text-green-400 mt-2">
                {opponent.username}
              </h3>
              <p className="text-lg text-white mt-2">
                Opponent's Score: {opponentscore}
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-lg text-white animate-pulse">
          Loading player data...
        </p>
      )}
    </div>
  );
}
