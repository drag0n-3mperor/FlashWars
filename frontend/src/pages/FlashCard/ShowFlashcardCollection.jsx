import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FlashcardCard } from "../../components/FlashcardCard.jsx";

export function ShowFlashcardCollection() {
  const { topicName } = useParams();
  const [flashcardCollection, setFlashcardCollecion] = useState(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/flashcards/view/${topicName}`, {
          withCredentials: true,
        });
        console.log(res?.data);
        return res;
      } catch (e) {
        console.error(e);
        return null;
      }
    };

    fetchFlashcards()
      .then(res => res.data)
      .then(res => setFlashcardCollecion({
        topic: res.topic,
        flashcards: res.flashcards,
      }));
  }, [topicName]);

  return (
    <div className="flex flex-col p-16 w-full min-h-screen">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        {flashcardCollection?.topic}
      </h2>
      <div className="flex flex-row flex-wrap w-full gap-2 justify-evenly">
        {flashcardCollection?.flashcards?.map((e, index) => (
          <FlashcardCard key={index} flashcard={e} />
        ))}
      </div>
    </div>
  );
}
