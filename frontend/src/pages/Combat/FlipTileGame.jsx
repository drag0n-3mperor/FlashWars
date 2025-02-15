import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function FlipTileGame() {
  const [tiles, setTiles] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [flipCount, setFlipCount] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const tileValues = Array.from({ length: 8 }, (_, i) => i + 1);
    const pairs = [...tileValues, ...tileValues];
    const shuffledTiles = pairs.sort(() => Math.random() - 0.5);
    setTiles(shuffledTiles);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Convert seconds to minutes and seconds
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleFlip = (index) => {
    if (
      flipped.length === 2 ||
      matched.includes(index) ||
      flipped.includes(index)
    )
      return;

    setFlipped((prev) => [...prev, index]);
    setFlipCount((prev) => prev + 1);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (tiles[first] === tiles[second]) {
        setTimeout(() => {
          setMatched((prev) => [...prev, first, second]);
        }, 500);
      }
      setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped, tiles]);

  const isRevealed = (index) =>
    flipped.includes(index) || matched.includes(index);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#f0f4f8] to-[#dce9f4]">
      {/* Container for Grid with counters */}
      <div className="grid grid-rows-[auto,1fr] gap-4 w-96">
        {/* Time and Flip Count (aligned left and right) */}
        <div className="flex justify-between p-4 text-xl text-[#2b7fff] font-bold">
          <div>Time: {formatTime(time)}</div>
          <div>Flips: {flipCount}</div>
        </div>

        {/* Game Tiles */}
        <div className="grid grid-cols-4 gap-4 p-4">
          {tiles.map((tile, index) => (
            <motion.div
              key={index}
              initial={{ scale: 1 }}
              animate={{
                scale: isRevealed(index) ? 1.1 : 1,
                opacity: matched.includes(index) ? 0 : 1,
                x: matched.includes(index) ? [0, -50, 50, 0] : 0, // Animation for the tiles when matched
                y: matched.includes(index) ? [0, -50, 50, 0] : 0, // Animation for the tiles when matched
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
                duration: matched.includes(index) ? 0.6 : 0.3,
              }}
              className="flex justify-center items-center p-4 w-24 h-24 bg-gradient-to-br from-[#f4fbce] to-[#d6e8a7] text-[#333] rounded-lg shadow-lg transition-all duration-300 cursor-pointer border-2 border-[#c7d49a]"
              onClick={() => handleFlip(index)}
            >
              {isRevealed(index) && !matched.includes(index) ? (
                <>
                  <h3 className="text-xl font-extrabold text-[#2b7fff] uppercase tracking-wide">
                    {tile}
                  </h3>
                  <div className="w-6 h-1 bg-[#2b7fff] rounded-full mt-2"></div>
                </>
              ) : null}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
