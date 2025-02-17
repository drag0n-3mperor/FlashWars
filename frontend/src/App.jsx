import { Navbar } from "./components/Navbar.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home.jsx";
import { FlashCard } from "./pages/FlashCard/FlashCard.jsx";
import { ShowAllFlashcard } from "./pages/FlashCard/ShowAllFlashcard.jsx";
import Footer from "./components/Footer.jsx";
import Auth from "./pages/Home/Auth.jsx";
// import { socket } from "./utils/socket.js";
import { useEffect } from "react";
import UserPrivateRoute from "./components/UserPrivateRoute.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import { Combat } from "./pages/Combat/Combat.jsx";
import { useSocket } from "./context/SocketContext.jsx";
import { MultiPlayer } from "./pages/Combat/MultiPlayer.jsx";
// import { SinglePlayer } from "./pages/Combat/SinglePlayer.jsx";
import FlipTileGame from "./pages/Combat/FlipTileGame.jsx";
import ReviseFlashcard from "./pages/FlashCard/ReviseFlashcard";
import { ShowFlashcardCollection } from "./pages/FlashCard/ShowFlashcardCollection.jsx";
import { Search } from "./pages/Search/Search.jsx";

function App() {
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected!");
      });

      socket.on("connect_error", (err) => {
        console.log(err);
      });

      socket.on("join", () => {
        console.log("searching for players");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected!");
      });
    }
  }, [socket]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/auth" element={<Auth />}></Route>

        <Route
          path="/profile"
          element={
            <UserPrivateRoute>
              <Profile />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/flashcards"
          element={
            <UserPrivateRoute>
              <FlashCard />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/flashcards/view"
          element={
            <UserPrivateRoute>
              <ShowAllFlashcard />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/flashcards/revise"
          element={
            <UserPrivateRoute>
              <ReviseFlashcard />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/flashcards/view/:collectionId"
          element={
            <UserPrivateRoute>
              <ShowFlashcardCollection />
            </UserPrivateRoute>
          }
        />

        <Route
          path="/games"
          element={
            <UserPrivateRoute>
              <Combat />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/games/single-player"
          element={
            <UserPrivateRoute>
              <FlipTileGame />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/games/multi-player"
          element={
            <UserPrivateRoute>
              <MultiPlayer />
            </UserPrivateRoute>
          }
        />

        <Route path="/search-flashcards/:searchQuery" element={<Search />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
