import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const flashcards = [
  {
    id: 1,
    text: "Volume of a Cone",
    status: "Study Again",
    imageUrl: "/assets/Cone_surface_area.svg",
  },
  {
    id: 2,
    text: "Area of a Circle",
    status: "Got It",
    imageUrl: "/assets/Circle_Area.svg",
  },
  {
    id: 3,
    text: "Pythagorean Theorem",
    status: "Study Again",
    imageUrl: "/assets/Einstein-trigonometric-proof.svg",
  },
  {
    id: 4,
    text: "Quadratic Formula",
    status: "Got It",
    imageUrl: "/assets/Quadratic_formula.svg",
  },
];

export function Animation() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-roboto">
      <div className="container mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-8 max-w-screen-md w-[70%]">
        <div className="w-full text-center lg:text-left mb-8 lg:mb-0">
          <h1 className="text-4xl font-extrabold mb-4 text-black">
            The easiest way to make and study flashcards
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            A better way to study with flashcards is here. FlashWars makes it
            simple to create your own flashcards, study those of a classmate, or
            search our archive of millions of flashcard decks from other
            students.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-blue-500 text-white p-3 rounded-md mr-4">
                <i className="fas fa-layer-group"></i>
              </div>
              <div>
                <p className="font-bold">Revise before exams</p>
                <p className="text-gray-600">In an assuredly easy way</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-pink-500 text-white p-3 rounded-md mr-4">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div>
                <p className="font-bold">90% of students</p>
                <p className="text-gray-600">
                  who use FlashWars report receiving higher grades
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-blue-500 text-white p-3 rounded-md mr-4">
                <i className="fas fa-chart-line"></i>
              </div>
              <div>
                <p className="font-bold">Play games</p>
                <p className="text-gray-600">in both single and multiplayer mode</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Link
              to="/flashcards"
              className="mt-16 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
            >
              Create a flashcard set
            </Link>
          </div>
        </div>
        <div className="w-full flex justify-center relative h-96 max-w-xs">
          <div className="absolute inset-0 bg-green-100 rounded-lg transform rotate-3 shadow-lg"></div>
          <div className="absolute inset-0 bg-white rounded-lg transform -rotate-3 shadow-lg"></div>
          <AnimatePresence>
            {flashcards.map(
              (card, index) =>
                index === currentIndex && (
                  <motion.div
                    key={card.id}
                    initial={{
                      x: card.status === "Study Again" ? 300 : -300,
                      opacity: 0,
                    }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{
                      x: card.status === "Study Again" ? -300 : 300,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`absolute inset-0 bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center border-2 ${card.status === "Study Again" ? "border-orange-300" : "border-green-300"} p-6 text-center`}
                  >
                    <div
                      className={`text-white font-bold px-3 py-1 rounded-full mb-3 ${card.status === "Study Again" ? "bg-orange-400" : "bg-green-400"}`}
                    >
                      {card.status}
                    </div>
                    {console.log(card.imageUrl)}
                    <img
                      src={card.imageUrl}
                      alt={card.text}
                      className="h-24 w-24 mb-3"
                    />
                    <p className="text-lg font-semibold text-gray-800">
                      {card.text}
                    </p>
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
