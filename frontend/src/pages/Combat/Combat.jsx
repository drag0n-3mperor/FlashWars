import { Link } from "react-router-dom";

export function Combat() {
  return (
    <div id="combat-container" className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Choose Your Game Mode</h1>
      <div className="flex flex-col space-y-4">
        <Link
          to="/games/single-player"
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-2xl hover:bg-blue-500 hover:scale-105 transition-all duration-200 ease-in-out"
        >
          Single Player
        </Link>
        <Link
          to="/games/multi-player"
          className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-2xl hover:bg-green-500 hover:scale-105 transition-all duration-200 ease-in-out"
        >
          Multi Player
        </Link>
      </div>
    </div>
  );
}
