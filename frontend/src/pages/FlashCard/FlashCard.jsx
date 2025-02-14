import "../styles/FlashCard.css";
import { CreateFlashcard } from "./CreateFlashcard.jsx";
import { FlashcardCard } from "../../components/FlashcardCard.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import axios from "axios";
import { useEffect, useState } from "react";

export const FlashCard = () => {
  const [flashcardCollections, setFlashcardCollections] = useState([]);
  console.log("flashcard component");

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/flashcards/view`,
          { withCredentials: true }
        );
        console.log(res);
        if (res.status === 200) {
          setFlashcardCollections(res.data.collections); // Update state with fetched flashcards
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFlashcards(); // Invoke the function to fetch flashcards
  }, []);
  console.log(flashcardCollections);
  return (
    <div className="flex flex-col g-0">
      <CreateFlashcard />
      <div id="flashcard-show-container">
        <div
          id="flashcard-show-header"
          className="flex flex-row justify-between p-8"
        >
          <p className="text-[#2b7fff] text-xl font-bold">Your flashcards</p>
          <Link to="/flashcards/view-all">Show All</Link>
        </div>
        <div
          id="flashcard-show-body"
          className="flex flex-row justify-evenly pl-8 pr-8 flex-wrap"
        >
          {flashcardCollections.length > 0 ? (
            flashcardCollections.map((flashcard, index) => (
              <FlashcardCard flashcard={flashcard} key={index} />
            ))
          ) : (
            <h2 className="text-gray-600 text-2xl font-bold">
              You have no flashcards yet... Create one to explore
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};
