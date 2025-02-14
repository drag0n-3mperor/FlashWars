import { useEffect, useState } from "react";
import axios from "axios";
import { FlashcardCard } from "../../components/FlashcardCard.jsx";

export function ShowFlashcard() {
  const [flashcardCollections, setFlashcardCollections] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [flashcardsByCollection, setFlashcardsByCollection] = useState({}); // Store flashcards per collection

  // Fetch flashcard collections on component mount
  useEffect(() => {
    const fetchFlashcardCollections = async () => {
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

    fetchFlashcardCollections();
  }, []);

  // Handle topic button clicks
  const handleTopicButtonClick = async (index) => {
    if (index === -1) {
      // Select all topics
      setSelectedTopics(flashcardCollections.map((_, idx) => idx));
      return;
    }

    setSelectedTopics((prevSelectedTopics) => {
      if (prevSelectedTopics.includes(index)) {
        // Deselect the topic
        return prevSelectedTopics.filter((item) => item !== index);
      } else {
        // Select the topic
        return [...prevSelectedTopics, index];
      }
    });

    // Fetch flashcards for the selected collection if not already fetched
    const selectedCollection = flashcardCollections[index];
    if (!flashcardsByCollection[selectedCollection._id]) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/flashcards/view/flashcard/${selectedCollection._id}`,
          { withCredentials: true }
        );
        if (res.status === 200) {
          setFlashcardsByCollection((prev) => ({
            ...prev,
            [selectedCollection._id]: res.data.flashcards,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      {/* Topic Buttons */}
      <div className="flex flex-row flex-wrap w-full gap-2 p-16 justify-evenly">
        {flashcardCollections.map((collection, index) => (
          <button
            key={index}
            className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg 
                        shadow-md transition duration-300 border-2 border-blue-500 
                        ${selectedTopics.includes(index) ? "selected-topic-name" : ""}`}
            onClick={() => handleTopicButtonClick(index)}
          >
            {collection.topic}
          </button>
        ))}
        {flashcardCollections.length > 0 && (
          <button
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg 
                        shadow-md transition duration-300 border-2 border-blue-500"
            onClick={() => handleTopicButtonClick(-1)}
          >
            View All
          </button>
        )}
      </div>

      {/* Flashcards Display */}
      <div className="flex flex-row flex-wrap w-full gap-2 pl-16 pr-16 justify-evenly">
        {flashcardCollections.map((collection, collectionIndex) => {
          if (selectedTopics.includes(collectionIndex)) {
            const flashcards = flashcardsByCollection[collection._id] || [];
            return flashcards.map((flashcard, flashcardIndex) => (
              <FlashcardCard
                key={`${collectionIndex}-${flashcardIndex}`}
                flashcard={flashcard}
              />
            ));
          }
          return null;
        })}
      </div>
    </div>
  );
}
