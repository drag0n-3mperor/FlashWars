import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext hook
import { useEffect } from "react";
export function Login() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser , user} = useAuth(); // Removed unused `user`

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    console.log("Login Data:", data);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        data,
        { withCredentials: true }
      );
      console.log(response)
      if (response.status === 201) {
        console.log("Full Response:", response);
        setIsAuthenticated(true); // Update authentication state
      
        // Fetch user profile after login
        const profileResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
          { withCredentials: true }
        );
        console.log("User Profile:", profileResponse.data);
        setUser(profileResponse.data); // Update the user in context
      
        // Navigate to profile page
        navigate("/profile");
      }
      
    } catch (e) {
      console.error("Login error:", e);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="login-form-container bg-white p-16 text-black"
      >
        <div className="form-group">
          <label htmlFor="email">Email or Username</label>
          <input
            type="text"
            id="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Enter your email"
            autoComplete="off"
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Enter your password"
            autoComplete="off"
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>
        <div className="login-form-submit-container w-full flex gap-2 justify-end">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
