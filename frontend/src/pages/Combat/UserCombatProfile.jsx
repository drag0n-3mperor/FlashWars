import { useEffect, useState } from "react";
import axios from "axios";

export function UserCombatProfile({ username }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserProfile = async (username) => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/search/username/${username}`
        );
        if (res.status === 200) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    getUserProfile(username);
  }, [username]);

  return (
    <div className="flex items-center p-3 gap-3 border border-gray-300 rounded-lg shadow-lg bg-gradient-to-r from-yellow-200 via-orange-100 to-yellow-300 w-64">
      {user ? (
        <>
          <img
            src={user.avatar || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
          />
          <p className="text-gray-800 font-semibold text-base">
            {user.username}
          </p>
        </>
      ) : (
        <p className="text-gray-500 text-sm italic animate-pulse">
          Waiting for user...
        </p>
      )}
    </div>
  );
}
