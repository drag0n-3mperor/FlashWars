import { Navbar } from "./components/Navbar.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home.jsx";
import { FlashCard } from "./pages/FlashCard/FlashCard.jsx";
import { ShowFlashcard } from "./pages/FlashCard/ShowFlashcard.jsx";
import Footer from "./pages/Home/Footer.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/flashcards" element={<FlashCard />}></Route>
        <Route path="/flashcards/view-all" element={<ShowFlashcard />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>

  );
}

export default App;
