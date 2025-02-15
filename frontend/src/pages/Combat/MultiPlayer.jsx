import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext.jsx";
import { CombatCard } from "../../components/CombatCard.jsx";
import { useAuth } from "../../context/AuthContext";

export function MultiPlayer() {
  const socket = useSocket();
  const { user } = useAuth();
  const [joining, setJoining] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [displayFlashcard, setDisplayFlashcard] = useState(null);

  useEffect(() => {
    // before check if user already has joined
    socket?.emit("check-joined");
    // isten to the response
    socket?.on("already-joined", (res) => {
      console.log(res);
      setRoomId(res.roomId);
      setDisplayFlashcard(
        res.clientFlashcards.at(
          Math.min(
            res.clientFlashcards.length - 1,
            res.status[String(user?.username)]?.length
          )
        )
      );
      setPlaying(true);
    });

    if (joining) {
      // requsest the backend to join the game
      socket.emit("join");
      console.log("joining player initialized");
      // listening to response
      socket.on("join", (res) => {
        console.log(res);
        setRoomId(res.roomId);
        setDisplayFlashcard(
          res.clientFlashcards.at(
            Math.min(
              res.clientFlashcards.length - 1,
              res.status[String(user?.username)]?.length
            )
          )
        );
        setJoining(false);
        setPlaying(true);
      });
    }

    if (playing) {
      // recieve the response the answer checking
      socket.on("recieve-answer", (res) => {
        console.log(res.status, res.clientFlashcards);
        setDisplayFlashcard(
          res.clientFlashcards.at(
            Math.min(
              res.clientFlashcards.length - 1,
              res.status[String(user?.username)].length
            )
          )
        );
      });

      // response after the game ends
      socket.on("game-result", (res) => {
        console.log(res);
      });
    }
  }, [playing, socket, joining]);

  return (
    <div id="multiplayer-container" className="flex flex-row gap-2 w-full">
      {joining || playing ? (
        <CombatCard flashcard={displayFlashcard} />
      ) : (
        <button onClick={() => setJoining(true)}>Play</button>
      )}
    </div>
  );
}
