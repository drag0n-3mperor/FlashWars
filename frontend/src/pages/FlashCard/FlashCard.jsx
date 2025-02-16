import { CreateFlashcard } from "./CreateFlashcard.jsx";
import { FlashcardCollectionCard } from "../../components/FlashcardCollectionCard.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export const FlashCard = () => {
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
    <div className="flex flex-col g-0">
      <CreateFlashcard flashcardCollections={flashcardCollections} />
      <div id="flashcard-show-container">
        <div
          id="flashcard-show-header"
          className="flex flex-row justify-between p-8"
        >
          <p className="text-[#2b7fff] text-xl font-bold">Your flashcards</p>
          {flashcardCollections?.length > 1 && (
            <Link
              to="/flashcards/view"
              className="text-[#2b7fff] font-semibold underline"
            >
              Show All
            </Link>
          )}
        </div>
        <div
          id="flashcard-show-body"
          className="flex flex-row justify-evenly pl-8 pr-8 flex-wrap"
        >
          {flashcardCollections.length > 0 ? (
            flashcardCollections
              .slice(0, 6)
              .map((flashcard, index) => (
                <FlashcardCollectionCard flashcard={flashcard} key={index} />
              ))
          ) : (
            <h2 className="text-gray-600 text-2xl font-bold min-h-48">
              You have no flashcards yet... Create one to explore
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};
