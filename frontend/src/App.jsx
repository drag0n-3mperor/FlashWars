import { Navbar } from "./components/Navbar.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home.jsx";
import { FlashCard } from "./pages/FlashCard/FlashCard.jsx";
import { ShowFlashcard } from "./pages/FlashCard/ShowFlashcard.jsx";
import Footer from "./pages/Home/Footer.jsx";
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

function App() {
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected!");
      });

      socket.on("connect_error", err => {
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
          path="/flashcards"
          element={
            <UserPrivateRoute>
              <FlashCard />
            </UserPrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <UserPrivateRoute>
              <Profile />
            </UserPrivateRoute>
          }
        ></Route>
        <Route path="/flashcards" element={<FlashCard />}></Route>
        <Route path="/flashcards/view-all" element={<ShowFlashcard />}></Route>
        <Route path="/combat" element={<Combat />}></Route>
        <Route path="/combat/single-player" element={<FlipTileGame />}></Route>
        <Route path="/combat/multi-player" element={<MultiPlayer />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>

  );
}

export default App;
