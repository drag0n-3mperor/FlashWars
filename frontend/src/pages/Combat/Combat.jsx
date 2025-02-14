import { Link } from "react-router-dom";

export function Combat() {
  return (
    <div id="combat-container">
      <Link to="/combat/single-player">Single Player</Link>
      <Link to="/combat/multi-player">Multi Player</Link>
    </div>
  )
}