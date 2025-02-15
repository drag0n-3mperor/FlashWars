// import { useAuth } from "../../context/AuthContext.jsx";
import "../styles/Home.css";
// import { LoginRegister } from "./LoginRegister.jsx";
import { Animation } from "./Animation.jsx";

export function Home() {

  // const { isAuthenticated } = useAuth();

  return (
    <>
      <Animation />
      {/* {!isAuthenticated && <LoginRegister />} */}
    </>
  );
}
