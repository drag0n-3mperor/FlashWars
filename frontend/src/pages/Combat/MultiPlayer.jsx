import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext.jsx";
import { CombatQuestionCard } from "./CombatQuestionCard.jsx";
import { useAuth } from "../../context/AuthContext";
import { combatTotalTime } from "../../constatnts.js";
import { UserCombatProfile } from "./UserCombatProfile.jsx";
import { ShowWinner } from "./ShowWinner.jsx";
import "../styles/Combat.css";
export function MultiPlayer() {
  const [gameEnded, setGameEnded] = useState(false); // Changed to state
  const [winner, setWinner] = useState(""); // Changed to state
  const [yourScore, setYourScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [combatTotalQuestions, setCombatTotalQuestions] = useState(3);
  const socket = useSocket();
  const [answersCurrentPlayer, setAnswersCurrentPlayer] = useState([]);
  const [answersOponent, setAnswersOponent] = useState([]);
  const { user } = useAuth();
  const [joining, setJoining] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [displayFlashcard, setDisplayFlashcard] = useState(null);
  const [players, setPlayers] = useState({ player1: "", player2: "" });
  const [timer, setTimer] = useState(combatTotalTime); // Timer state

  useEffect(() => {
    // before check if user already has joined
    socket?.emit("check-joined");

    // listen to the response
    socket?.on("already-joined", (res) => {
      console.log(res);
      setRoomId(res.roomId);
      setCombatTotalQuestions(res.clientFlashcards.length);
      setPlayers({ player1: res.player1, player2: res.player2 });
      setDisplayFlashcard(
        res.clientFlashcards.at(
          Math.min(
            res.clientFlashcards.length - 1,
            res.status[String(user?.username)]?.length
          )
        )
      );
      setPlaying(true);
      setLoadingQuestions(false);
    });

    if (joining) {
      // request the backend to join the game
      socket.emit("join");
      console.log("joining player initialized");

      // listening to response
      socket.on("join", (res) => {
        setCombatTotalQuestions(res.clientFlashcards.length);
        console.log(res);
        setRoomId(res.roomId);
        setPlayers({ player1: res.player1, player2: res.player2 });
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
        setLoadingQuestions(false);
      });
    }

    if (playing) {
      // receive the response for answer checking
      socket.on("recieve-answer", (res) => {
        console.log(res.status, res.clientFlashcards);
        setAnswersCurrentPlayer(res.status[String(user?.username)]);
        const opponentKey =
          String(user?.username) === String(players.player1)
            ? String(players.player2)
            : String(players.player1);
        setAnswersOponent(res.status[opponentKey]);
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
        setYourScore(res.points[String(user?.username)]);
        setOpponentScore(
          res.points[
            String(user?.username) === String(players.player1)
              ? String(players.player2)
              : String(players.player1)
          ]
        );
        setWinner(String(res.winner)); // Set winner state
        setGameEnded(true); // Set gameEnded state
        console.log(res);
      });

      // Start the timer when the game starts
      const timerInterval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime > 0) {
            return prevTime - 1;
          } else {
            clearInterval(timerInterval); // Clear the interval when time is up
            socket.emit("game-over", { roomId }); // Notify the backend
            return 0;
          }
        });
      }, 1000);

      // Clear timer and event listeners when component unmounts or playing state changes
      return () => {
        clearInterval(timerInterval);
        socket.off("recieve-answer");
        socket.off("game-result");
        socket.off("join");
        socket.off("already-joined");
      };
    }
  }, [
    playing,
    socket,
    joining,
    roomId,
    user?.username,
    players.player1,
    players.player2,
  ]);

  return gameEnded ? (
    <div className="flex items-center justify-center">
      <ShowWinner
        yourname={String(user?.username)}
        opponentname={
          String(user?.username) === String(players.player1)
            ? String(players.player2)
            : String(players.player1)
        }
        winner={winner}
        yourscore={yourScore}
        opponentscore={opponentScore}
      />
    </div>
  ) : (
    <div
      id="multiplayer-container"
      className="flex flex-col items-center gap-4 w-full min-h-screen"
    >
      {playing && (
        <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
          <span className="text-2xl font-bold text-white">Time: {timer}s</span>
        </div>
      )}
      {joining || playing ? (
        <div>
          <div className="flex items-start justify-center gap-8 p-4">
            {/* First Card */}
            <div className="flex flex-col items-center justify-start w-full max-w-md p-6 bg-gradient-to-r from-[#fbe6a2] via-[#f4d35e] to-[#f9a825] rounded-lg shadow-lg gap-6 border border-gray-200">
              {!loadingQuestions && (
                <AnswerIndicators
                  submissions={answersCurrentPlayer}
                  combatTotalQuestions={combatTotalQuestions}
                />
              )}
              <UserCombatProfile
                username={
                  String(user?.username) === String(players.player1)
                    ? players.player1
                    : players.player2
                }
              />
              <div className="w-83 h-105">
                <CombatQuestionCard flashcard={displayFlashcard} />
              </div>
            </div>

            {/* Second Card */}
            <div className="flex flex-col items-center justify-start w-full max-w-md p-6 bg-gradient-to-r from-[#f9a825] via-[#f4d35e] to-[#fbe6a2] rounded-lg shadow-lg gap-6 border border-gray-200">
              {!loadingQuestions && (
                <AnswerIndicators
                  submissions={answersOponent}
                  combatTotalQuestions={combatTotalQuestions}
                />
              )}
              <UserCombatProfile
                username={
                  String(user?.username) !== String(players.player1)
                    ? players.player1
                    : players.player2
                }
              />
              {/* Empty section with blur effect */}

              <div className="w-83 h-105 bg-gradient-to-r from-[#f4fbce] via-[#e8f7a5] to-[#dff27e] rounded-md animate-shimmer animate-blur-effect"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <button
            onClick={() => setJoining(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-2xl shadow-md hover:shadow-lg hover:from-blue-400 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Play
          </button>
        </div>
      )}
    </div>
  );
}

export function AnswerIndicators({ submissions, combatTotalQuestions }) {
  const [statuses, setStatuses] = useState(
    Array(combatTotalQuestions).fill("unanswered")
  );

  // Update statuses based on the submissions array
  useEffect(() => {
    if (submissions?.length) {
      const updatedStatuses = Array(combatTotalQuestions).fill("unanswered");
      submissions.forEach((submission, index) => {
        updatedStatuses[index] = submission === true ? "correct" : "wrong";
      });
      setStatuses(updatedStatuses);
    }
  }, [submissions]);

  return (
    <div className="flex items-center gap-2">
      {statuses.map((status, index) => (
        <div
          key={index}
          className={`w-6 h-6 rounded-full border border-gray-300 shadow-md ${
            status === "correct"
              ? "bg-green-500"
              : status === "wrong"
                ? "bg-red-500"
                : "bg-gray-400"
          }`}
        ></div>
      ))}
    </div>
  );
}
