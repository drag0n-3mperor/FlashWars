import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

export function CombatCard({ flashcard }) {
  const socket = useSocket();
  const [inputText, setInputText] = useState("");

  const handleSubmit = () => {
    socket.emit("send-answer", inputText);
  };

  return (
    <>
      {flashcard ? (
        <div className="flex flex-col gap-4 p-4 m-2 w-48 h-48 bg-[#f4fbce] text-[#706a6a] rounded-lg shadow-md">
          <p className="text-sm">{flashcard.content}</p>
          <div>
            {/* <button className="answer-select-button" id="1-answer-select-button">
          {flashcard.answer}
        </button>
        <button
          className="answer-select-button"
          id="1-answer-select-button"
        ></button>
        <button
          className="answer-select-button"
          id="1-answer-select-button"
        ></button>
        <button
          className="answer-select-button"
          id="1-answer-select-button"
        ></button> */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="border-1 border-amber-950s"
            />
            <button type="submit" onClick={handleSubmit}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <>Waiting for player</>
      )}
    </>
  );
}
