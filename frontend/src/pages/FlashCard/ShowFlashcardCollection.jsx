import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FlashcardCard } from "../../components/FlashcardCard.jsx";
import { LoaderComponent } from "../../components/LoaderComponent"

export function ShowFlashcardCollection() {
  const { collectionId } = useParams();
  const [flashcardCollection, setFlashcardCollection] = useState(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/flashcards/view/collection/${collectionId}`);
        console.log(res?.data);

        return res;
      } catch (e) {
        console.error(e);
        return null;
      }
    };

    fetchFlashcards()
      .then(res => res.data)
      .then(res => setFlashcardCollection({
        topic: res.topic,
        flashcards: res.flashcards,
      }));
  }, [collectionId]);

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
          <div><LoaderComponent/></div>
        )}
      </div>
    </div>
  );
}
