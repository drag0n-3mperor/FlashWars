import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const UserPrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/refresh`,
          {
            withCredentials: true, // Ensures cookies are sent
          }
        );
        console.log("Auto-signin response:", response.data); // Debugging log

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else if (response.status === 403) {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log(
          "Auto-signin error:",
          error.response?.data || error.message
        ); // More robust error logging
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/home#login-register-form-container" />
  );
};

export default UserPrivateRoute;
