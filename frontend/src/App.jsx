import { Navbar } from "./components/Navbar.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home.jsx";
import { FlashCard } from "./pages/FlashCard/FlashCard.jsx";
import { ShowFlashcard } from "./pages/FlashCard/ShowFlashcard.jsx";
import Footer from "./pages/Home/Footer.jsx";
import Auth from "./pages/Home/Auth.jsx";
import { socket } from "./utils/socket.js";
import { useEffect } from "react";
import UserPrivateRoute from "./components/UserPrivateRoute.jsx";
import Profile from "./pages/Profile/Profile.jsx";

function App() {

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected!");
    });

    socket.on("connect_error", err => {
      console.log(err);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected!");
    });
  }, []);

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
      </Routes>
      <Footer />
    </BrowserRouter>

  );
}

export default App;
