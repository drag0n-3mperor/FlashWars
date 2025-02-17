import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Footer = () => {
  // State for the contact form
  const [email, setEmail] = useState("Bhupendra@doe.com");
  const [message, setMessage] = useState("");
  const location = useLocation();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message Sent!");
  };

  return (
    location.pathname !== "/auth" && (
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left section */}
            <div className="flex flex-col items-center">
              <img
                alt="Logo"
                src="/title_transparent.svg"
                className="w-36 m-4"
              />
              <p className="text-center mb-2 text-sm sm:text-base">
                Empowering students with opportunities. Join the journey of
                innovation and learning.
              </p>
              <p className="text-center mb-2 text-sm sm:text-base">
                © Flashwars 2025. All rights reserved.
              </p>
              <div className="flex space-x-3">
                <a className="text-white" href="#">
                  <i className="fab fa-github"></i>
                </a>
                <a className="text-white" href="#">
                  <i className="fab fa-discord"></i>
                </a>
                <a className="text-white" href="#">
                  <i className="fas fa-envelope"></i>
                </a>
                <a className="text-white" href="#">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>

            {/* Archives section */}
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <h2
                className="text-lg font-bold mb-3 sm:text-xl"
                style={{ color: "#d4a5ff" }}
              >
                Quick Link
              </h2>
              <ul className="space-y-1 text-xs sm:text-sm">
                <li>
                  <Link to="/flashcards" className="text-white">
                    Create Flashcard
                  </Link>
                </li>
                <li>
                  <Link to="/flashcards/view" className="text-white">
                    View All Flashcards
                  </Link>
                </li>
                <li>
                  <Link to="/flashcards/revise" className="text-white">
                    Revise
                  </Link>
                </li>
                <li>
                  <Link to="/games" className="text-white">
                    Combat
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Us section */}
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-3 sm:text-xl">Contact Us</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label
                    className="block text-xs mb-1 sm:text-sm"
                    htmlFor="email"
                  >
                    Your Email
                  </label>
                  <input
                    className="w-full p-2 rounded bg-gray-700 text-white text-sm sm:text-base"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label
                    className="block text-xs mb-1 sm:text-sm"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    className="w-full p-2 rounded bg-gray-700 text-white text-sm sm:text-base"
                    id="message"
                    placeholder="Your message here..."
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button
                  className="w-full p-2 rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  type="submit"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Container (non-sticky) */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 sm:py-6">
          <div className="container mx-auto text-center">
            <p className="text-sm sm:text-base">
              © FLASHWARS 2025. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default Footer;
