import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const location = useLocation();
  const [isProfilePage, setIsProfilePage] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // State for menu visibility
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
    setIsProfilePage(location.pathname === "/profile");
  }, [location]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/logout`,
        { withCredentials: true }
      );
      if (res.status === 201) {
        setIsAuthenticated(false);
        navigate("/home");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // Function to handle screen size change
    const handleResize = (e) => {
      if (e.matches) {
        setMenuOpen(false);
      }
    };
    // media query for md-breakpoint(768px)
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    mediaQuery.addEventListener("change", handleResize);
    // Clean up the event listener on unmount
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);
const handleSearch = (searchQuery)=>{
  navigate(`/search-flashcards/${searchQuery}`);
}
  return (
    <div className="relative">
      {/* Navbar */}
      <div className="flex justify-between items-center p-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm rounded-b-lg shadow-gray-400 z-50">
        {/* Logo */}
        <div className="text-3xl font-bold text-white w-32">
          <Link to="/home">
            <img src="/title_transparent.svg" alt="Logo" />
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div
          className="text-white cursor-pointer md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img src="/menu.svg" className="w-6 h-6" alt="Menu" />
        </div>

        {/* Desktop Navbar Items */}
        <div className="hidden md:flex gap-6 items-center">
          {/* Search Field */}
          {showSearch && (
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent page reload
                handleSearch(searchQuery);
              }}
              className="w-full"
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 p-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </form>
          )}
          {/* Search Icon */}
          <div
            className="flex flex-col items-center text-white hover:scale-110 transition-transform cursor-pointer"
            onClick={() => setShowSearch(!showSearch)}
          >
            <img src="/search.svg" className="w-6 h-6" alt="Search" />
            <p className="text-sm">Search</p>
          </div>

          {/* Other Navbar Items */}
          <Link
            to="/games"
            className="flex flex-col items-center text-white hover:scale-110 transition-transform"
          >
            <img src="/combat.svg" className="w-6 h-6" alt="Games" />
            <p className="text-sm">Games</p>
          </Link>
          <Link
            to="/flashcards"
            className="flex flex-col items-center text-white hover:scale-110 transition-transform"
          >
            <img src="/add.svg" className="w-6 h-6" alt="Create" />
            <p className="text-sm">Create</p>
          </Link>
          <Link
            to="/flashcards/view"
            className="flex flex-col items-center text-white hover:scale-110 transition-transform"
          >
            <img src="/collection.svg" className="w-6 h-6" alt="View" />
            <p className="text-sm">View</p>
          </Link>
          <Link
            to="/flashcards/revise"
            className="flex flex-col items-center text-white hover:scale-110 transition-transform"
          >
            <img src="/bookmark.svg" className="w-6 h-6" alt="Revise" />
            <p className="text-sm">Revise</p>
          </Link>
          {isAuthenticated ? (
            isProfilePage ? (
              <button
                className="flex flex-col items-center text-white hover:scale-110 transition-transform"
                onClick={handleLogout}
              >
                <img src="/logout.svg" className="w-6 h-6" alt="Logout" />
                <p className="text-sm">Logout</p>
              </button>
            ) : (
              <Link
                to="/profile"
                className="flex flex-col items-center text-white hover:scale-110 transition-transform"
              >
                <img src="/profile.svg" className="w-6 h-6" alt="Profile" />
                <p className="text-sm">Profile</p>
              </Link>
            )
          ) : (
            <Link
              to="/auth"
              className="flex flex-col items-center text-white hover:scale-110 transition-transform"
            >
              <img src="/login.svg" className="w-6 h-6" alt="Login" />
              <p className="text-sm">Login</p>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-0 top-full w-full bg-white shadow-md p-4 flex flex-col gap-4">
          <Link to="/games" className="text-gray-800">
            Games
          </Link>
          <Link to="/flashcards" className="text-gray-800">
            Create
          </Link>
          <Link to="/flashcards/view" className="text-gray-800">
            View
          </Link>
          <Link to="/flashcards/revise" className="text-gray-800">
            Revise
          </Link>
          {isAuthenticated ? (
            isProfilePage ? (
              <button onClick={handleLogout} className="text-gray-800">
                Logout
              </button>
            ) : (
              <Link to="/profile" className="text-gray-800">
                Profile
              </Link>
            )
          ) : (
            <Link to="/auth" className="text-gray-800">
              Login
            </Link>
          )}
          {/* Search Field */}
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 p-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
