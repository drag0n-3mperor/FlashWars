import { useState } from "react";

export function FlashcardCard({ flashcard }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    if (flashcard.answer) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className="relative w-64 h-72 perspective-1000" onClick={handleFlip}>
      {/* Flip Container */}
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Side - Question */}
        <div className="absolute w-full h-full flex flex-col justify-center items-center gap-4 p-6 
                        bg-gradient-to-br from-green-100 to-green-300 text-gray-800 
                        rounded-3xl shadow-lg border border-green-400 backface-hidden">
          <h3 className="text-xl font-bold text-blue-600 uppercase tracking-wide text-center">
            {flashcard.question}
          </h3>
          <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
          
          {flashcard.answer && (
            !isFlipped ?
            <p className="text-sm text-gray-600 font-medium italic">
              Click to reveal answer
            </p>
            :
            <p className="text-sm text-gray-600 font-medium italic rotate-y-180">
              {flashcard.answer}
            </p>
          )}
        </div>

        {/* Back Side - Answer (Only If Exists) */}
        {flashcard.answer && (
          <div className="absolute w-full h-full flex flex-col justify-center items-center gap-4 p-6 
                          bg-gradient-to-br from-blue-100 to-blue-300 text-gray-800 
                          rounded-3xl shadow-lg border border-blue-400 rotate-y-180 backface-hidden">
            <h3 className="text-xl font-bold text-red-600 uppercase tracking-wide text-center">
              {flashcard.answer}
            </h3>
            {/* <div className="w-16 h-1 bg-red-500 rounded-full"></div>
            <p className="text-sm text-gray-600 font-medium italic">
              Click to flip back
            </p> */}
          </div>
        )}
      </div>
    </div>
  );
}
