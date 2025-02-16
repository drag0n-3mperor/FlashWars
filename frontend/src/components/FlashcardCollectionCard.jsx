import { useNavigate } from "react-router-dom";

export function FlashcardCollectionCard({ flashcard }) {
  const navigate = useNavigate();
  const noOfFlashcards = flashcard.FlashcardsId
    ? flashcard.FlashcardsId.length
    : 0;

  return (
    <button
      onClick={() => navigate(`/flashcards/view/${flashcard._id}`)}
      className="flex flex-col justify-center items-center gap-4 p-6 m-4 w-60 h-64 bg-gradient-to-br from-[#f4fbce] to-[#d6e8a7] text-[#333] rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 hover:bg-gradient-to-bl hover:from-[#d6e8a7] hover:to-[#f4fbce] transition-transform transition-colors duration-300 ease-in-out cursor-pointer border-2 border-[#c7d49a]"
    >
      <h3 className="text-xl font-extrabold text-[#2b7fff] uppercase tracking-wider mb-2">
        {flashcard.topic}
      </h3>
      <div className="w-12 h-1 bg-[#2b7fff] rounded-full"></div>
      <p className="text-sm text-gray-600 font-medium">
        {noOfFlashcards}
        {noOfFlashcards === 0 || noOfFlashcards === 1
          ? " Flashcard"
          : " Flashcards"}
      </p>
    </button>
  );
}
