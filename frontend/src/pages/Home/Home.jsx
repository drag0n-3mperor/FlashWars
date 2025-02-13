import { useAuth } from "../../context/AuthContext.jsx";
import "../styles/Home.css";
import { LoginRegister } from "./LoginRegister.jsx";

export function Home() {

  const { isAuthenticated } = useAuth();

  return (
    <>
      <div id="home-container" className="h-full flex flex-row p-16 gap-8 primary-bg justify-evenly">
        <div className="flex flex-col justify-evenly text-xl">
          <h2
            className="text-center text-2xl font-bold"
            style={{ color: "#90E0EF" }}
          >
            {"The easiest way to make and manage flash cards"}
          </h2>
          <h2 className="text-center text-2xl font-bold">
            {
              "Learn. Remember. Master.\nFlashcards made smarter, faster, and fun!"
            }
          </h2>
        </div>
        <img src="flashcards-home.svg" className="w-64" />
      </div>
      {!isAuthenticated && <LoginRegister />}
    </>
  );
}
