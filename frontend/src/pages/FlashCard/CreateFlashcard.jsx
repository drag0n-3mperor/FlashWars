import { useState } from "react";
import axios from "axios";

export function CreateFlashcard() {
  const [isContentTypeFlashcard, setIsContentTypeFlashcard] = useState(true);
  const [topicName, setTopicName] = useState("");
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [answerInput, setAnswerInput] = useState("");
  const [message, setMessage] = useState(null);

  const topicNames = [
    "Artificial Intelligence",
    "Machine Learning",
    "Web Development",
    "Data Science",
    "Cloud Computing",
    "Cybersecurity",
    "Blockchain",
    "Internet of Things",
    "DevOps",
    "Software Engineering",
  ];

  const handleContentTypeButton = (e) => {
    e.preventDefault();
    setIsContentTypeFlashcard(e.target.id === "content-type-flashcard");
  };

  const handleTopicNameChange = (e) => {
    const userInput = e.target.value;
    setTopicName(userInput);

    const filteredSuggestions = topicNames.filter((topic) =>
      topic.toLowerCase().includes(userInput.toLowerCase())
    );

    setSuggestions(filteredSuggestions);
    setShowSuggestions(userInput.length > 0 && filteredSuggestions.length > 0);
  };

  const handleAnswerChange = (e) => {
    setAnswerInput(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setTopicName(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/flashcards/create`,
        {
          question: content,
          answer: answerInput,
          topic: topicName,
        },
        { withCredentials: true }
      );

      if (res.status === 201) {
        setMessage({ type: "success", text: "Flashcard created successfully!" });
        handleClear();
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "An error occurred. Please try again.",
      });
    }

    // Auto-hide the message after 3 seconds
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleClear = () => {
    setTopicName("");
    setContent("");
    setAnswerInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="h-full flex flex-col p-16 gap-8 primary-bg">
      <h2 className="text-center w-full text-2xl font-bold">Create Your FlashCard</h2>

      {message && (
        <div
          className={`p-4 mb-4 ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flashcard-form-container">
        <div className="flashcard-form-button-container w-full flex gap-2">
          <button
            id="content-type-flashcard"
            onClick={handleContentTypeButton}
            className={isContentTypeFlashcard ? "selected-button-flashcard-create" : ""}
          >
            Content Type
          </button>
          <button
            id="qna-type-flashcard"
            onClick={handleContentTypeButton}
            className={!isContentTypeFlashcard ? "selected-button-flashcard-create" : ""}
          >
            Q/A Type
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flashcard-create-form-container bg-white p-16 text-black"
        >
          <div>
            <input
              type="text"
              id="topicname"
              name="topicname"
              value={topicName}
              onChange={handleTopicNameChange}
              placeholder="Topic Name"
              autoComplete="off"
            />
            {showSuggestions && (
              <div
                style={{
                  border: "1px solid #ccc",
                  maxHeight: "150px",
                  overflowY: "auto",
                  marginTop: "5px",
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    style={{ padding: "8px", cursor: "pointer" }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
            />
          </div>
          {!isContentTypeFlashcard && (
            <div>
              <input
                type="text"
                id="answer"
                name="answer"
                value={answerInput}
                onChange={handleAnswerChange}
                placeholder="Answer"
                autoComplete="off"
              />
            </div>
          )}
          <div className="flashcard-form-submit-container w-full flex gap-2 justify-end">
            <button type="submit">Create</button>
            <button type="button" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
