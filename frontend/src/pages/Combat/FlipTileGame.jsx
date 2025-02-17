import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function FlipTileGame() {
  const [tiles, setTiles] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [flipCount, setFlipCount] = useState(0);
  const [time, setTime] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [questionMap, setQuestionMap] = useState(new Map());
  const [play, setPlay] = useState(false);
  const timerId = useRef();

  useEffect(() => {
    if (!play) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/flashcards/show/`,
          {
            params: { limit: 2, answerOnly: true },
            withCredentials: true,
          }
        );

        console.log(res?.data?.flashcards);
        if (!res?.data?.flashcards) return;

        const newQuestionMap = new Map();
        let pairs = [];

        res.data.flashcards.forEach((e) => {
          newQuestionMap.set(e.question, e.answer);
          newQuestionMap.set(e.answer, e.question);
          pairs.push(e.question, e.answer);
        });

        setQuestionMap(newQuestionMap);
        setTiles(shuffleArray(pairs));
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
    timerId.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timerId.current);
  }, [play]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleFlip = (index) => {
    if (
      flipped.includes(index) ||
      flipped.length === 2 ||
      matched.includes(index)
    )
      return;
    setFlipped((prev) => [...prev, index]);
    setFlipCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (questionMap.get(tiles[first]) === tiles[second]) {
        setTimeout(() => {
          setMatched((prev) => [...prev, first, second]);
        }, 500);
      }
      setTimeout(() => {
        setFlipped([]);
      }, 1000);
    }
  }, [flipped, questionMap, tiles]);

  useEffect(() => {
    if (matched.length === tiles.length) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
  }, [matched]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 p-4">
      {!play ? (
        <motion.button
          onClick={() => setPlay(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg text-xl font-bold transition-all duration-300 hover:shadow-xl"
        >
          Play
        </motion.button>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-between w-full max-w-md text-xl font-bold text-white">
            <div>
              Time: {Math.floor(time / 60)}:
              {(time % 60).toString().padStart(2, "0")}
            </div>
            <div>Flips: {flipCount}</div>
          </div>

          {matched.length === tiles.length && (
            <h2 className="text-6xl font-bold text-green-500 animate-pulse mt-32">
              🎉 You Win! 🎉
            </h2>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tiles.map((tile, index) => (
              <motion.div
                key={index}
                initial={{ scale: 1 }}
                animate={{
                  scale:
                    flipped.includes(index) ||
                    matched.includes(index) ||
                    hoverIndex === index
                      ? 1.1
                      : 1,
                  opacity: matched.includes(index) ? 0 : 1,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
                className="flex justify-center text-[0.8rem] items-center p-4 w-36 h-28 bg-gradient-to-br from-yellow-300 to-orange-400 text-gray-900 rounded-lg shadow-xl cursor-pointer border-4 border-yellow-500 font-extralight text-lg hover:shadow-2xl"
                onClick={() => handleFlip(index)}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {flipped.includes(index) || matched.includes(index) ? (
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-800 text-center"
                  >
                    {tile}
                  </motion.h3>
                ) : null}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
