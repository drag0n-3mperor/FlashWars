import { useState } from "react";
import { useSocket } from "../../context/SocketContext";

export function CombatQuestionCard({ flashcard }) {
  const socket = useSocket();
  const [selectedOption, setSelectedOption] = useState("");

  const handleSubmit = () => {
    if (selectedOption) {
      socket.emit("send-answer", selectedOption);
    }
  };

  return (
    <>
  {flashcard ? (
    <div className="relative flex flex-col gap-4 p-6 m-4 w-80 bg-gradient-to-r from-[#f4fbce] to-[#e0f5ab] text-[#4a4a4a] rounded-lg shadow-lg border border-gray-300 overflow-hidden">
      {/* Blur background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f4fbce] to-[#e0f5ab] animate-blur-effect blur-lg rounded-lg z-0"></div>

      {/* Foreground content */}
      <p className="text-lg font-semibold z-10 relative">
        {flashcard.question}
      </p>
      <div className="flex flex-col gap-3 z-10 relative">
        {flashcard.options?.map((option, index) => (
          <button
            key={index}
            className={`p-3 rounded-md shadow-sm border border-gray-400 text-sm font-medium cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              selectedOption === option
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "bg-white text-gray-800 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200"
            }`}
            onClick={() => setSelectedOption(option)}
          >
            {option}
          </button>
        ))}
        <button
          type="submit"
          className="mt-4 p-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:from-green-600 hover:to-green-700 hover:scale-105 transition-all duration-300"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-[200px] text-gray-600">
      Waiting for player...
    </div>
  )}
</>

  );
}
