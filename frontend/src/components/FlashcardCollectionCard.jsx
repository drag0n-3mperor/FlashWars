import { useNavigate } from "react-router-dom";

export function FlashcardCollectionCard({ flashcard }) {
  const navigate = useNavigate();
  const noOfFlashcards = flashcard.FlashcardsId
    ? flashcard.FlashcardsId.length
    : 0;

  return (
    <button
      onClick={() => navigate(`/flashcards/view/${flashcard._id}`)}
      className="flex flex-col items-center justify-center gap-4 p-6 w-64 h-72 
                 bg-gradient-to-br from-green-100 to-green-300 text-gray-800 
                 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 
                 hover:bg-gradient-to-bl hover:from-green-300 hover:to-green-100 
                 transition-transform transition-colors duration-300 ease-in-out 
                 border border-green-400 cursor-pointer"
    >
      {/* Flashcard Topic Title */}
      <h3 className="text-xl font-bold text-blue-600 uppercase tracking-wide text-center">
        {flashcard.topic}
      </h3>

      {/* Decorative Line */}
      <div className="w-16 h-1 bg-blue-500 rounded-full"></div>

      {/* Flashcard Count */}
      <p className="text-sm text-gray-700 font-medium">
        {noOfFlashcards} {noOfFlashcards === 1 ? "Flashcard" : "Flashcards"}
      </p>
    </button>
  );
}
