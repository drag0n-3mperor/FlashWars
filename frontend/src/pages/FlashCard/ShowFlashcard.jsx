import { useState } from "react";
import { FlashcardCard } from "../../components/FlashcardCard.jsx";

export function ShowFlashcard() {
  const flashcardCollections = [
    {
      topicName: "React",
      flashcards: [
        {
          content: "What is JSX?",
          answer: "A. A JavaScript syntax extension",
        },
        {
          content: "What is the virtual DOM?",
        },
        {
          content: "What are React hooks?",
        },
        {
          content: "What is the useState hook?",
          answer: "A. A React Hook that lets you add state to functional components",
        },
        {
          content: "What is the useEffect hook?",
        },
      ],
    },
    {
      topicName: "JavaScript",
      flashcards: [
        {
          content: "What is the difference between '==' and '==='?",
          answer: "A. '==' checks only value, '===' checks value and type",
        },
        {
          content: "What is a closure in JavaScript?",
          answer: "A. A function that remembers its lexical scope",
        },
        {
          content: "What is the difference between var, let, and const?",
          answer: "A. 'var' has function scope, 'let' and 'const' have block scope",
        },
      ],
    },
    {
      topicName: "MongoDB",
      flashcards: [
        {
          content: "What type of database is MongoDB?",
          answer: "B. NoSQL",
        },
        {
          content: "What is the purpose of MongoDB's ObjectId?",
          answer: "B. To uniquely identify documents",
        },
      ],
    },
    {
      topicName: "Express.js",
      flashcards: [
        {
          content: "What is middleware in Express?",
          answer: "A. A function that runs during request-response cycle",
        },
      ],
    },
    {
      topicName: "Node.js",
      flashcards: [
        {
          content: "What is the event loop in Node.js?",
          answer: "A. A mechanism for handling asynchronous operations",
        },
        {
          content: "What does process.nextTick() do?",
        },
      ],
    },
    {
      topicName: "Cybersecurity",
      flashcards: [
        {
          content: "What is cross-site scripting (XSS)?",
          answer: "A. A security vulnerability that allows attackers to inject malicious scripts",
        },
        {
          content: "What is SQL injection?",
        },
      ],
    },
    {
      topicName: "Blockchain",
      flashcards: [
        {
          content: "What is a blockchain?",
        },
        {
          content: "What is a smart contract?",
          answer: "A. A self-executing contract with terms written in code",
        },
      ],
    },
    {
      topicName: "5G Technology",
      flashcards: [
        {
          content: "What is the primary advantage of 5G?",
          answer: "A. Higher data speeds and lower latency",
        },
        {
          content: "What frequency bands are used in 5G?",
        },
      ],
    },
    {
      topicName: "AR/VR",
      flashcards: [
        {
          content: "What is Augmented Reality (AR)?",
          answer: "A. An enhanced version of reality using digital overlays",
        },
        {
          content: "What is the primary difference between AR and VR?",
        },
      ],
    },
    {
      topicName: "Cloud Computing",
      flashcards: [
        {
          content: "What is cloud computing?",
          answer: "A. The delivery of computing services over the internet",
        },
        {
          content: "What is the difference between SaaS, PaaS, and IaaS?",
        },
      ],
    },
    {
      topicName: "DevOps",
      flashcards: [
        {
          content: "What is DevOps?",
          answer: "A. A methodology that combines software development and IT operations",
        },
        {
          content: "What tool is commonly used for containerization?",
          answer: "A. Docker",
        },
      ],
    },
    {
      topicName: "Networking",
      flashcards: [
        {
          content: "What is the purpose of an IP address?",
          answer: "A. To uniquely identify a device on a network",
        },
        {
          content: "What is the difference between TCP and UDP?",
        },
      ],
    },
  ];

  const [selectedTopics, setSelectedTopics] = useState([]);

  const handleTopicButtonClick = (index) => {
    setSelectedTopics((prevSelectedTopics) => {
      if (index === -1) {
        return flashcardCollections.map((e, index) => index);
      }
      if (prevSelectedTopics.includes(index)) {
        return prevSelectedTopics.filter((item) => item !== index);
      } else {
        return [...prevSelectedTopics, index];
      }
    });
  };

  return (
    <div>
      <div className="flex flex-row flex-wrap w-full gap-2 p-16 justify-evenly">
        {flashcardCollections.map((e, index) => (
          <button
            key={index}
            className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg 
                        shadow-md transition duration-300 border-2 border-blue-500 
                        ${selectedTopics.includes(index) ? "selected-topic-name" : ""}`}
            onClick={() => handleTopicButtonClick(index)}
          >
            {e.topicName}
          </button>
        ))}
        {flashcardCollections.length > 0 &&
          (<button
            className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg 
                        shadow-md transition duration-300 border-2 border-blue-500`}
            onClick={() => handleTopicButtonClick(-1)}>View All</button>)}
      </div>
      <div className="flex flex-row flex-wrap w-full gap-2 pl-16 pr-16 justify-evenly">
        {flashcardCollections.map((e, index) => {
          if (selectedTopics.includes(index)) {
            return e.flashcards.map((item, index) => {
              const flashcard = { ...item, topicName: e.topicName };
              return (<FlashcardCard key={index} flashcard={flashcard} />);
            });
          }
        })}
      </div>
    </div>
  );
}
