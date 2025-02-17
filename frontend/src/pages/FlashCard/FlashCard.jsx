import { CreateFlashcard } from "./CreateFlashcard.jsx";
import { FlashcardCollectionCard } from "../../components/FlashcardCollectionCard.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { LoaderComponent } from "../../components/LoaderComponent.jsx"; // Import loader component

export const FlashCard = () => {
  const [flashcardCollections, setFlashcardCollections] = useState([]);
  const [loader, setLoader] = useState(false); // Add loader state

  useEffect(() => {
    const fetchFlashcards = async () => {
      setLoader(true); // Show loader before fetching
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
      setLoader(false); // Hide loader after fetching
    };

    fetchFlashcards();
  }, []);

  return (
    <div className="flex max-w-4xl bg-white mx-auto flex-col min-h-screen m-8" style={{ borderRadius: "1rem" }}>
      {/* Create Flashcard Section */}
      <CreateFlashcard flashcardCollections={flashcardCollections} />

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
        {loader ? (
          <div className="flex justify-center items-center col-span-full">
            <LoaderComponent /> {/* Display loader while fetching */}
          </div>
        ) : flashcardCollections.length > 0 ? (
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
