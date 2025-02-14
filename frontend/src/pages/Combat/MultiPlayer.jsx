import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext.jsx";
import { FlashcardCard } from "../../components/FlashcardCard";
import { CombatCard } from "../../components/CombatCard.jsx";
import { useAuth } from "../../context/AuthContext";

export function MultiPlayer() {
  const socket = useSocket();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [displayFlashcard, setDisplayFlashcard] = useState(null);

  useEffect(() => {
    if (isPlaying) {
      socket.emit("join");
      console.log("joining player initialized");
      socket.on("join", (res) => {
        console.log(res);
        setRoomId(res.roomId);
        setDisplayFlashcard(res.flashcards[0]);
      });

      socket.on("recieve-answer", (res) => {
        console.log(res.status, res.flashcards);
        if (res.status[String(user?.username)].length >= 0)
          setDisplayFlashcard(
            res.flashcards.at(
              Math.min(
                res.flashcards.length - 1,
                res.status[String(user?.username)].length
              )
            )
          );
      });
    }
  }, [isPlaying, socket]);

  return (
    <div id="multiplayer-container" className="flex flex-row gap-2 w-full">
      {isPlaying ? (
        <CombatCard flashcard={displayFlashcard} />
      ) : (
        <button onClick={() => setIsPlaying(!isPlaying)}>Play</button>
      )}
    </div>
  );
}
