import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/FlashCard.css";
import { FlashcardCard } from "../../components/FlashcardCard.jsx";
import { LoaderComponent } from "../../components/LoaderComponent.jsx"
export default function ReviseFlashcard() {
  const [topicNames, setTopicNames] = useState([]);
  const [flashcardCollections, setFlashcardCollections] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [fullDeck, setFullDeck] = useState([]);
  const [emptyDeck, setEmptyDeck] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [reviseAnimating, setReviseAnimating] = useState(false);
  const [showDonePopup, setShowDonePopup] = useState(false);
  const [selectedTopicNames, setSelectedTopicNames] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
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
    setShowDonePopup(false);
  };

  const handleGotIt = (card) => {
    setAnimating(true);
    setTimeout(() => {
      // console.log(card);
      console.log(fullDeck);
      const newDeck = fullDeck.filter((c) => c._id !== card._id);
      // console.log(newDeck);
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
    <>
      {!loading ? (
        <div className="p-6 min-h-screen flex flex-col gap-8 items-center justify-start m-8">
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

          {selectedTopics.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8 w-full">
              {/* Selected Flashcards Section */}
              <div className="flex flex-col gap-4 justify-center items-center border min-w-sm p-6 rounded-2xl bg-white shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Selected Flashcards
                </h2>

                {fullDeck[0] && (
                  <div
                    className={`flex justify-center w-full perspective-1000 
                ${animating ? "transition-all duration-500 transform translate-x-40 border-4 border-green-500 opacity-0" : ""} 
                ${reviseAnimating ? "transition-all duration-500 transform -translate-x-40 border-4 border-red-500 opacity-0" : ""} 
                ${fullDeck.length > 0 ? "visible" : "invisible"}`}
                  >
                    <FlashcardCard flashcard={fullDeck[0]} />
                  </div>
                )}

                {fullDeck.length > 0 && (
                  <div className="flex w-full justify-center gap-4 mt-4">
                    <button
                      className="bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:bg-green-700 hover:scale-105 hover:shadow-lg"
                      onClick={() => handleGotIt(fullDeck[0])}
                    >
                      ✅ Got It
                    </button>
                    <button
                      className="bg-yellow-500 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:bg-yellow-600 hover:scale-105 hover:shadow-lg"
                      onClick={() => handleReviseAgain(fullDeck[0])}
                    >
                      🔄 Revise Again
                    </button>
                  </div>
                )}
              </div>

              {/* Reviewed Flashcards Section */}
              <div className="min-w-sm min-h-full border p-6 rounded-2xl bg-white shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Reviewed Flashcards
                </h2>
                <div>
                  {emptyDeck.length > 0 ? (
                    <ul className="space-y-2">
                      {emptyDeck.map((card) => (
                        <li
                          key={card.id}
                          className="p-3 bg-green-200 rounded-lg shadow-sm"
                        >
                          {card.question}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No Cards Here</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-4xl font-bold">
              Select topics to revise
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen"><LoaderComponent/></div>
      )}
    </>
  );
}
