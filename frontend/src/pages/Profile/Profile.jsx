import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // Ensure the correct path
import { FlashcardCollectionCard } from "../../components/FlashcardCollectionCard.jsx";

const Profile = () => {
  const { user } = useAuth(); // Access user from AuthContext
  const [flashcardCollections, setFlashcardCollections] = useState([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/flashcards/view`,
          { withCredentials: true }
        );
        if (res.status === 200) {
          setFlashcardCollections(res.data.collections);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFlashcards();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img
            src={user?.avatar || "https://via.placeholder.com/100"}
            alt="Profile"
            className="rounded-full w-24 h-24 mr-4 border-2 border-black transition-transform duration-300 transform hover:scale-105"
          />
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">
              {user?.fullname || "Username"}
            </h2>
            <div className="flex items-center">
              <span className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard Collection Section */}
      <h3 className="text-3xl font-semibold mb-2 relative inline-block group">
        Flashcard Collections
        <span className="block h-1 bg-black scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100" />
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {flashcardCollections.map((collection, index) => {
          return (
            <FlashcardCollectionCard
              key={index}
              flashcard={collection}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
