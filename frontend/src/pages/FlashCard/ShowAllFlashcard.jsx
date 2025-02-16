import { useEffect, useState } from "react";
import axios from "axios";
import { FlashcardCollectionCard } from "../../components/FlashcardCollectionCard.jsx";

export function ShowAllFlashcard() {
  const [flashcardCollections, setFlashcardCollections] = useState([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/flashcards/view`,
          { withCredentials: true }
        );
        console.log(res.data);
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
    <div className="max-w-4xl bg-white mx-auto mt-6 mb-6 shadow-md shadow-gray-400 rounded-3xl">
      {/* Header Section */}
      <div
        className="flex items-center justify-center bg-blue-700 p-6 rounded-t-3xl"
      >
        <h2 className="text-2xl font-bold text-white">Your Flashcards</h2>
      </div>

      {/* Flashcards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {flashcardCollections.length > 0 ? (
          flashcardCollections.map((flashcard, index) => (
            <FlashcardCollectionCard flashcard={flashcard} key={index} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-600 text-xl font-semibold py-16">
            <p>You have no flashcards yet...</p>
            <p className="text-gray-500 text-lg mt-2">Create one to explore!</p>
          </div>
        )}
      </div>
    </div>
  );
}
