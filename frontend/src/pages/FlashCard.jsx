import { useState } from "react";
import "./styles/FlashCard.css";

export function FlashCard() {
  const [isContentTypeFlashcard, setIsContentTypeFlashcard] = useState(true);
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

  // form data
  const [topicName, setTopicName] = useState("");
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [answerInput, setAnswerInput] = useState("");

  const handleContentTypeButton = (e) => {
    e.preventDefault();
    if (e.target.id === "content-type-flashcard") {
      setIsContentTypeFlashcard(true);
    } else {
      setIsContentTypeFlashcard(false);
    }
  };

  const handleTopicNameChange = (e) => {
    const userInput = e.target.value;
    setTopicName(userInput);

    const filteredSuggestions = topicNames.filter((topic) =>
      topic.toLowerCase().includes(userInput.toLowerCase()),
    );

    setSuggestions(filteredSuggestions);
    setShowSuggestions(userInput.length > 0 && filteredSuggestions.length > 0);
  };

  const handleAnswerChange = (e) => {
    const userInput = e.target.value;
    setAnswerInput(userInput);
  };

  const handleSuggestionClick = (suggestion) => {
    setTopicName(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Form Submitted!\nTopic: ${topicName}\nContent: ${content}`);
  };

  const handleClear = () => {
    setTopicName("");
    setContent("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <>
      <div
        id="flashcard-create-container"
        className="h-full flex flex-col p-16 gap-8 primary-bg"
      >
        <h2 className="text-center w-full text-2xl font-bold">
          Create Your FlashCard
        </h2>
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
          {isContentTypeFlashcard ? (
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
              <div className="flashcard-form-submit-container w-full flex gap-2 justify-end">
                <button type="submit">Create</button>
                <button type="button" onClick={handleClear}>
                  Clear
                </button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flashcard-create-form-container bg-white p-16 text-black"
            >
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
              </div>
              <div className="flashcard-form-submit-container w-full flex gap-2 justify-end">
                <button type="submit">Create</button>
                <button type="button" onClick={handleClear}>
                  Clear
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
