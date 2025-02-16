import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FlashcardCard } from "../../components/FlashcardCard.jsx";

export function ShowFlashcardCollection() {
  const { topicName } = useParams();
  const [flashcardCollection, setFlashcardCollection] = useState(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/flashcards/view/${topicName}`,
          { withCredentials: true }
        );
        return res;
      } catch (e) {
        console.error(e);
        return null;
      }
    };

    fetchFlashcards()
      .then((res) => res?.data)
      .then((res) =>
        setFlashcardCollection({
          topic: res?.topic,
          flashcards: res?.flashcards || [],
        })
      );
  }, [topicName]);

  return (
    <div className="max-w-4xl bg-white mx-auto mt-6 mb-6 shadow-md shadow-gray-400 rounded-3xl">
      {/* Header Section */}
      <div className="flex items-center justify-center bg-blue-700 p-6 rounded-t-3xl">
        <h2 className="text-2xl font-bold text-white">{flashcardCollection?.topic}</h2>
      </div>

      {/* Flashcards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {flashcardCollection?.flashcards?.length > 0 ? (
          flashcardCollection.flashcards.map((flashcard, index) => (
            <FlashcardCard key={index} flashcard={flashcard} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center text-gray-600 text-xl font-semibold py-16">
            <p>No flashcards available...</p>
            <p className="text-gray-500 text-lg mt-2">Create one to start learning!</p>
          </div>
        )}
      </div>
    </div>
  );
}
