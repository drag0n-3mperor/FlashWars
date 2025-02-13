import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // Import AuthContext

export function Register() {
  const { setIsAuthenticated } = useAuth(); // Use context for updating auth state
  const navigate = useNavigate();
  const [registerInitiated, setRegisterInitiated] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [formData, setFormData] = useState(null);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleRegister = async (data) => {
    try {
      console.log("Form Data:", data);
      const tempFormData = new FormData();
      tempFormData.append("username", data.username);
      tempFormData.append("fullname", data.fullname);
      tempFormData.append("email", data.email);
      tempFormData.append("password", data.password);
      setFormData(tempFormData);
      setRegisteredEmail(data.email);

      if (data.profileImage[0]) {
        tempFormData.append("profileImage", data.profileImage[0]);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/register`,
        tempFormData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setRegisterInitiated(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpError("");
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/verify-otp`,
        { email: registeredEmail, otp },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log("OTP verified successfully");
        setIsAuthenticated(true); // Update authentication state
        navigate("/users/profile");
      } else {
        setOtpError("OTP verification failed");
      }
    } catch (e) {
      console.error("Error during OTP verification:", e);
      setOtpError("An error occurred while verifying OTP");
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/register`, formData, {
        withCredentials: true,
      });
      console.log("OTP resent successfully");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="register-form-container bg-white p-16 text-black">
      {/* Registration Form */}
      <form onSubmit={handleSubmit(handleRegister)} className="register-form-container">
        {/* Username */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "Username must be at least 3 characters long" },
            })}
            placeholder="Enter your username"
            autoComplete="off"
          />
          {errors.username && <span className="error">{errors.username.message}</span>}
        </div>

        {/* Other form fields (Full Name, Email, Password, etc.) remain the same */}

        <div className="register-form-submit-container w-full flex gap-2 justify-end">
          <button type="submit" disabled={registerInitiated}>
            Register
          </button>
        </div>
      </form>

      {/* OTP Verification Form */}
      {registerInitiated && (
        <form onSubmit={handleOtpSubmit} className="register-form-container">
          <div className="form-group">
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter the 6-digit OTP"
              maxLength="6"
            />
            {otpError && <span className="error">{otpError}</span>}
          </div>
          <div className="register-form-submit-container w-full flex gap-2 justify-end">
            <button type="submit">Verify OTP</button>
            <button onClick={handleResendOtp}>Resend OTP</button>
          </div>
        </form>
      )}
    </div>
  );
}
