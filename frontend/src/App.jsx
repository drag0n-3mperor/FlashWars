import { Navbar } from "./components/Navbar.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home.jsx";
import { FlashCard } from "./pages/FlashCard/FlashCard.jsx";
import { ShowFlashcard } from "./pages/FlashCard/ShowFlashcard.jsx";
import UserPrivateRoute from "./components/UserPrivateRoute.jsx";
import Profile from "./pages/Profile/Profile.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
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
    </BrowserRouter>
  );
}

export default App;
