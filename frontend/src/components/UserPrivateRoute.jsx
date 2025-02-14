import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserPrivateRoute = ({ children }) => {
  const { isAuthenticated , isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  // Wait for authentication check before deciding
  if (isAuthenticated === null) return <div>Loading...</div>;

  console.log("userprivateroute- ", isAuthenticated);
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/home#login-register-form-container" />
  );
};


export default UserPrivateRoute;
