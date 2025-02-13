import { useState } from "react";

export function FlashcardCard({ flashcard }) {
  const [isAnswerShown, setIsAnswerShown] = useState(false);

  const handleAnswerClick = (e) => {
    e.preventDefault();
    setIsAnswerShown(true);
  }

  return (
    <div className="flex flex-col gap-4 p-4 m-2 w-48 h-48 bg-[#f4fbce] text-[#706a6a] rounded-lg shadow-md">
      <h3 className="text-lg font-semibold">{flashcard.topicName}</h3>
      <p className="text-sm">{flashcard.content}</p>
      {flashcard.answer && !isAnswerShown && (
        <button
          className="mt-auto p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleAnswerClick}
        >
          Show Answer
        </button>
      )}
      {flashcard.answer && isAnswerShown && (
        <p>{flashcard.answer}</p>
      )}
    </div>
  );
}