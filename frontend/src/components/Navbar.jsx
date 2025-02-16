import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext hook
import { useEffect, useState } from "react";
import axios from "axios";

export function Navbar() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const location = useLocation();
  const [isProfilePage, setIsProfilePage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location.pathname);
    console.log(isAuthenticated);
    if (location.pathname === "/profile") {
      setIsProfilePage(true);
    } else {
      setIsProfilePage(false);
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/logout`,
        {
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        console.log(`User logout successfully.`);
        setIsAuthenticated(false);
        navigate("/home");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      id="navbar"
      className={`flex justify-between items-center p-4 
        w-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm 
        rounded-b-lg shadow-gray-400 z-50`}
    >
      {/* Logo */}
      <div id="navbar-logo" className="text-3xl font-bold text-white w-32">
        <Link to="/home">
          <img src="/title_transparent.svg" />
        </Link>
      </div>

      {/* Navbar Items */}
      <div id="navbar-items-container" className="flex gap-6">
        <div className="flex flex-col items-center text-white hover:scale-110 transition-transform">
          <img
            src="/search.svg"
            className="w-6 h-6 fill-white hover:fill-gray-200 transition-colors"
          />
          <p className="text-sm">Search</p>
        </div>
        <Link
          to="/combat"
          className="flex flex-col items-center text-white hover:scale-110 transition-transform"
        >
          <img
            src="/combat.svg"
            className="w-6 h-6 fill-white hover:fill-gray-200 transition-colors"
          />
          <p className="text-sm">Combat</p>
        </Link>
        <Link
          to="/flashcards"
          className="flex flex-col items-center text-white hover:scale-110 transition-transform"
        >
          <img
            src="/add.svg"
            className="w-6 h-6 fill-white hover:fill-gray-200 transition-colors"
          />
          <p className="text-sm">Create</p>
        </Link>
        <Link
          to="/flashcards/view"
          className="flex flex-col items-center text-white hover:scale-110 transition-transform"
        >
          <img
            src="/collection.svg"
            className="w-6 h-6 fill-white hover:fill-gray-200 transition-colors"
          />
          <p className="text-sm">View</p>
        </Link>
        <Link
          to="/flashcards/revise"
          className="flex flex-col items-center text-white hover:scale-110 transition-transform"
        >
          <img
            src="/bookmark.svg"
            className="w-6 h-6 fill-white hover:fill-gray-200 transition-colors"
          />
          <p className="text-sm">Revise</p>
        </Link>
        {isAuthenticated ? (
          !isProfilePage ? (
            <Link
              to="/profile"
              className="flex flex-col items-center text-white hover:scale-110 transition-transform"
            >
              <img
                src="/profile.svg"
                className="w-6 h-6 fill-white hover:fill-gray-200 transition-colors"
              />
              <p className="text-sm">Profile</p>
            </Link>
          ) : (
            <button
              className="flex flex-col cursor-pointer items-center text-white hover:scale-110 transition-transform"
              onClick={handleLogout}
            >
              <img
                src="/logout.svg"
                className="w-6 h-6 fill-white hover:fill-gray-200 transition-colors"
              />
              <p className="text-sm">Logout</p>
            </button>
          )
        ) : (
          <Link
            to="/auth"
            className="flex flex-col items-center text-white hover:scale-110 transition-transform"
          >
            <img
              src="/login.svg"
              className="w-6 h-6 fill-white hover:fill-gray-200 transition-colors"
            />
            <p className="text-sm">Login</p>
          </Link>
        )}
      </div>
    </div>
  );
}
