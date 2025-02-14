import { Link } from "react-router-dom";
import "./styles/Navbar.css";
import { useAuth } from "../context/AuthContext"; // Import AuthContext hook

export function Navbar() {
  const { isAuthenticated } = useAuth();

  console.log(isAuthenticated);
  return (
    <div id="navbar" className="flex flex-row justify-between p-4 w-full">
      <div id="navbar-logo" className="text-3xl font-bold m-4 mt-0 mb-0">
        <Link to="/home">FlashWars</Link>
      </div>
      <div id="navbar-items-container" className="flex flex-row justify-evenly">
        <div className="navbar-items">
          <img src="/search.svg" />
          <p>Search</p>
        </div>
        <Link to="/combat" className="navbar-items">
          <img src="/combat.svg" />
          <p>Combat</p>
        </Link>
        <Link to="/flashcards" className="navbar-items">
          <img src="/add.svg" />
          <p>Create</p>
        </Link>
        {isAuthenticated ? (
          <Link to="/profile" className="navbar-items">
            <img src="/profile.svg" />
            <p>Profile</p>
          </Link>
        ) : (
          <Link to="/auth" className="navbar-items">
            <img src="/login.svg" />
            <p>Login</p>
          </Link>
        )}
      </div>
    </div>
  );
}
