import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FlashcardCollectionCard } from "../../components/FlashcardCollectionCard.jsx";
import { Link } from "react-router-dom";
import '../styles/Combat.css';

const Profile = () => {
  const { user } = useAuth();
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
    <div className="max-w-4xl mx-auto mt-6 mb-6 bg-white shadow-lg rounded-2xl overflow-hidden">
      {/* Profile Section */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 animate-shimmer  to-indigo-600 p-6 rounded-t-2xl">
        <div className="flex items-center">
          <img
            src={user?.imageUrl || "/assets/DEFAULT_AVATAR.jpg"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/assets/DEFAULT_AVATAR.jpg";
            }}
            alt="Profile Avatar"
            className="h-24 w-24 object-cover rounded-full border-4 border-white shadow-md"
          />
          <div className="ml-4">
            <h2 className="text-3xl font-semibold text-white">
              {user?.fullname || "Username"}
            </h2>
            <div className="flex items-center mt-1">
              <span className={`${user?.rating ? "text-yellow-300 text-lg font-bold" : "text-gray-300"}`}>
                {user?.rating ? `${user.rating} ★` : "Unrated"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard Collection Section */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
        <p className="text-blue-600 text-2xl font-bold">Your Flashcards</p>
        {flashcardCollections?.length > 1 && (
          <Link
            to="/flashcards/view"
            className="text-blue-600 font-semibold underline hover:text-blue-800 transition duration-300"
          >
            Show All
          </Link>
        )}
      </div>

      {/* Flashcard Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {flashcardCollections.length > 0 ? (
          flashcardCollections.slice(0, 6).map((flashcard, index) => (
            <FlashcardCollectionCard flashcard={flashcard} key={index} />
          ))
        ) : (
          <h2 className="text-gray-500 text-xl font-semibold text-center col-span-full min-h-48 flex items-center justify-center">
            You have no flashcards yet... Create one to explore
          </h2>
        )}
      </div>
    </div>
  );
};

export default Profile;
