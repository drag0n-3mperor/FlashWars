import { FlashcardCard } from "../../components/FlashcardCard.jsx";

export function ShowFlashcard() {
  const flashcards = [
    // {
    //   topicName: "JavaScript Basics",
    //   content: "What is a variable in JavaScript?",
    //   answer: "A variable is a container for storing data values.",
    // },
    // {
    //   topicName: "Web Development",
    //   content: "What does HTML stand for?",
    //   answer: "HyperText Markup Language",
    // },
    // {
    //   topicName: "Data Structures",
    //   content: "What is a linked list?",
    // },
    // {
    //   topicName: "Algorithms",
    //   content: "What is the time complexity of binary search?",
    //   answer: "O(log n)",
    // },
    // {
    //   topicName: "React",
    //   content: "What is JSX?",
    // },
  ];

  return (
    <div id="flashcard-show-container">
      <div id="flashcard-show-header" className="flex flex-row justify-between p-8">
        <p className="text-[#2b7fff] text-xl font-bold">Your flashcards</p>
        <button>Show All</button>
      </div>
      <div id="flashcard-show-body" className="flex flex-row justify-evenly pl-8 pr-8 flex-wrap">
        {flashcards.length > 0 ? flashcards.map((flashcard, index) => (
          <FlashcardCard flashcard={flashcard} index={index} />
        )) :
          (<h2 className="text-gray-600 text-2xl font-bold">You have no flashcards yet... Create one to explore</h2>)}
      </div>
    </div>
  )
}