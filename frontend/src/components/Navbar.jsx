import { Link } from "react-router-dom";
import './styles/Navbar.css';

export function Navbar() {
  return (
    <div id="navbar" className="flex flex-row justify-between p-4 w-full">
      <div id="navbar-logo" className="text-3xl font-bold m-4 mt-0 mb-0">
        <Link to="/home">FlashWars</Link>
      </div>
      <div id="navbar-items-container" className="flex flex-row justify-evenly">
        <div className="navbar-items">
          <img src="search.svg" />
          <p>Search</p>
        </div>
        <Link to="/" className="navbar-items">
          <img src="settings.svg" />
          <p>Options</p>
        </Link>
        <Link to="/flashcards" className="navbar-items">
          <img src="add.svg" />
          <p>Create</p>
        </Link>
        <Link to="/#login-register-form-body" className="navbar-items">
          <img src="login.svg" />
          <p>Login</p>
        </Link>
      </div>
    </div>
  );
}