import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/FlashCard.css";

export default function ReviseFlashcard() {
  const [topicNames, setTopicNames] = useState([]);
  const [flashcardCollections, setFlashcardCollections] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [fullDeck, setFullDeck] = useState([]);
  const [emptyDeck, setEmptyDeck] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [reviseAnimating, setReviseAnimating] = useState(false);
  const [showDonePopup, setShowDonePopup] = useState(false);
  const [selectedTopicNames, setSelectedTopicNames] = useState([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/flashcards/view-all`,
          { withCredentials: true }
        );
        console.log(res.data);
        if (res.status === 200) {
          setFlashcardCollections(res.data.collections);
          setTopicNames(res.data.topics);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFlashcards();
  }, []);

  const handleTopicClick = (topic) => {
    setSelectedTopics((prev) => {
      const newTopics = prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic];
      setFullDeck(newTopics.flatMap((t) => flashcardCollections[t] || []));
      return newTopics;
    });
    setSelectedTopicNames((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
    setEmptyDeck([]);
    setFlipped(false);
    setShowDonePopup(false);
  };

  const handleGotIt = (card) => {
    setAnimating(true);
    setTimeout(() => {
      const newDeck = fullDeck.filter((c) => c.id !== card.id);
      setFullDeck(newDeck);
      setEmptyDeck([...emptyDeck, card]);
      setAnimating(false);
      if (newDeck.length === 0) {
        setShowDonePopup(true);
      }
    }, 500);
  };

  const handleReviseAgain = (card) => {
    setReviseAnimating(true);
    setTimeout(() => {
      setFullDeck([...fullDeck.slice(1), fullDeck[0]]);
      setReviseAnimating(false);
    }, 500);
  };

  useEffect(() => {
    if (showDonePopup) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 5000); // *5 seconds instead of 10*

      return () => clearTimeout(timer);
    }
  }, [showDonePopup]);

  return (
    <div className="p-6 min-h-screen flex flex-col gap-4 items-center justify-center">
      <div className="flex flex-row gap-4 w-full justify-evenly">
        {topicNames?.map((topic, index) => (
          <button
            key={index}
            className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg 
                        shadow-md transition duration-300 border-2 border-blue-500 
                        ${selectedTopicNames.includes(topic) ? "selected-topic-name" : ""}`}
            onClick={() => handleTopicClick(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      {
        <div
          className={`grid grid-cols-2 gap-8 w-full max-w-4xl ${selectedTopics.length > 0 ? "visible" : "invisible"}`}
        >
          <div className="border p-4 rounded bg-white">
            <h2 className="text-lg font-bold mb-2">Selected Flashcards</h2>
            {
              <div
                className={`relative w-full h-40 perspective-1000 ${animating ? "transition-all duration-500 transform translate-x-40 border-4 border-green-500 opacity-0" : ""} ${reviseAnimating ? "transition-all duration-500 transform -translate-x-40 border-4 border-red-500 opacity-0" : ""} ${fullDeck.length > 0 ? "visible" : "invisible"}`}
              >
                <div
                  className={`absolute w-full h-full transform transition-transform duration-500 ${flipped ? "rotate-y-180" : ""}`}
                  onClick={() => setFlipped(!flipped)}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center bg-gray-200 rounded p-4">
                    <p className="text-center">{fullDeck[0]?.question}</p>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-2 transition duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(true);
                      }}
                    >
                      Show Answer
                    </button>
                  </div>
                  <div className="absolute w-full h-full backface-hidden flex justify-center items-center bg-white rounded p-4 rotate-y-180">
                    <p className="text-center text-lg font-semibold">
                      {console.log(fullDeck) && fullDeck[0].answer}
                    </p>
                  </div>
                </div>
              </div>
            }
            {fullDeck.length > 0 && (
              <div className="flex justify-between mt-2">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out transform hover:bg-green-700 hover:scale-105"
                  onClick={() => handleGotIt(fullDeck[0])}
                >
                  Got It
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded transition duration-300 ease-in-out transform hover:bg-yellow-700 hover:scale-105"
                  onClick={() => handleReviseAgain(fullDeck[0])}
                >
                  Revise Again
                </button>
              </div>
            )}
          </div>

          <div className="border p-4 rounded bg-white">
            <h2 className="text-lg font-bold mb-2">Reviewed Flashcards</h2>
            {emptyDeck.length > 0 ? (
              <ul>
                {emptyDeck.map((card) => (
                  <li key={card.id} className="p-2 bg-green-200 mb-1 rounded">
                    {card.question}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No Cards Here</p>
            )}
          </div>
        </div>
      }

      {showDonePopup && (
        <div className="fixed top-10 right-10 bg-green-500 text-white px-6 py-3 rounded shadow-lg">
          All Done!
        </div>
      )}
    </div>
  );
}
