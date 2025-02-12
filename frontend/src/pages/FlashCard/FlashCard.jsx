import "../styles/FlashCard.css";
import { CreateFlashcard } from "./CreateFlashcard.jsx";
import { FlashcardCard } from "../../components/FlashcardCard.jsx";
import { Link } from "react-router-dom";

export function FlashCard() {
  const flashcards = [
    {
      topicName: "JavaScript Basics",
      content: "What is a variable in JavaScript?",
      answer: "A variable is a container for storing data values.",
    },
    {
      topicName: "Web Development",
      content: "What does HTML stand for?",
      answer: "HyperText Markup Language",
    },
    {
      topicName: "Data Structures",
      content: "What is a linked list?",
    },
    {
      topicName: "Algorithms",
      content: "What is the time complexity of binary search?",
      answer: "O(log n)",
    },
    {
      topicName: "React",
      content: "What is JSX?",
    },
  ];

  return (
    <div className="flex flex-col g-0">
      <CreateFlashcard />
      <div id="flashcard-show-container">
        <div id="flashcard-show-header" className="flex flex-row justify-between p-8">
          <p className="text-[#2b7fff] text-xl font-bold">Your flashcards</p>
          <Link to="/flashcards/view-all">Show All</Link>
        </div>
        <div id="flashcard-show-body" className="flex flex-row justify-evenly pl-8 pr-8 flex-wrap">
          {flashcards.length > 0 ? flashcards.map((flashcard, index) => (
              <FlashcardCard flashcard={flashcard} key={index} />
            )) :
            (<h2 className="text-gray-600 text-2xl font-bold">You have no flashcards yet... Create one to explore</h2>)}
        </div>
      </div>
    </div>
  )
}
