import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FlashcardCollectionCard } from "../../components/FlashcardCollectionCard";
import { LoaderComponent } from "../../components/LoaderComponent"
export function Search() {
  const { searchQuery } = useParams(); // Correctly access searchQuery
  const [users, setUsers] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/search/${searchQuery}`
        );
        if (res.status === 200) {
          setCollections(res.data.collections || []); // Ensure valid data
          setUsers(res.data.users || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (searchQuery) {
      fetchSearchResults(); // Fetch results when searchQuery is defined
    }
  }, [searchQuery]); // Re-run effect if searchQuery changes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {collections.length > 0 ? (
        collections.map((collection, index) => (
          <div
            key={index}
            className="w-full max-w-3xl flex flex-col items-center gap-4 p-6 border border-gray-300 rounded-lg shadow-lg bg-white mb-6"
          >
            {/* Collection */}
            <FlashcardCollectionCard flashcard={collection} />

            {/* Corresponding User */}
            {users[index] && <UserProfile user={users[index]} />}
          </div>
        ))
      ) : (
        <div><LoaderComponent/></div>
      )}
    </div>
  );
}

function UserProfile({ user }) {
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
        <p className="text-gray-500 text-sm italic animate-pulse">Loading</p>
      )}
    </div>
  );
}
