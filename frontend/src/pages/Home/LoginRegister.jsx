import { useState } from "react";
import { Login } from "./Login.jsx";
import { Register } from "./Register.jsx";

export function LoginRegister() {
  const [isLoginForm, setIsLoginForm] = useState(true);

  const handleHeaderButtonClick = (e) => {
    e.preventDefault();
    if (e.target.id === "login-form-button") {
      setIsLoginForm(true);
    } else {
      setIsLoginForm(false);
    }
  };

  return (
    <div id="login-register-form-container" className="m-16">
      <div className="login-register-header-button flex flex-row gap-2">
        <button
          id="login-form-button"
          className={isLoginForm ? "selected-button-login-register" : ""}
          onClick={handleHeaderButtonClick}
        >
          Login
        </button>
        <button
          id="register-form-button"
          className={!isLoginForm ? "selected-button-login-register" : ""}
          onClick={handleHeaderButtonClick}
        >
          Register
        </button>
      </div>
      <div className="login-register-form-body">
        {isLoginForm ? <Login /> : <Register />}
      </div>
    </div>
  );
}