import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserPrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) return <div>Loading...</div>;

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/home#login-register-form-container" />
  );
};

export default UserPrivateRoute;
