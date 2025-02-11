import { Navbar } from "./components/Navbar.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import { FlashCard } from "./pages/FlashCard.jsx";

function App() {
  return (
    <BrowserRouter>
        <Navbar />
      <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/flashcards" element={<FlashCard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
