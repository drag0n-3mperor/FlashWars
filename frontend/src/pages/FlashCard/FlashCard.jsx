import "../styles/FlashCard.css";
import { CreateFlashcard } from "./CreateFlashcard.jsx";
import { ShowFlashcard } from "./ShowFlashcard.jsx";

export function FlashCard() {
  return (
    <div className="flex flex-col g-0">
      <CreateFlashcard />
      <ShowFlashcard />
    </div>
  )
}
