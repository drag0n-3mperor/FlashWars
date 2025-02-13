// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/refresh`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          setIsAuthenticated(true);

          // Fetch the user profile immediately after successful refresh
          const profileResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
            { withCredentials: true }
          );
          console.log(profileResponse);
          setUser(profileResponse.data); // Persist user state
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
