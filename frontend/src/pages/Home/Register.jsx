import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
export function Register() {
  const navigate = useNavigate();
  const [registerInitiated, setRegisterInitiated] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("")
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
      const tempFromData = new FormData();
      tempFromData.append("username", data.username);
      tempFromData.append("fullname", data.fullname);
      tempFromData.append("email", data.email);
      tempFromData.append("password", data.password);
      setFormData(tempFromData);
      setRegisteredEmail(data.email);

      if (data.profileImage[0]) {
        tempFromData.append("profileImage", data.profileImage[0]);
      }

      // post register form
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/register`,tempFromData, {
        withCredentials: true,
      });
      console.log(response)
      // const responseData = await response.json();
      // console.log(responseData.message);

      if (response.status===200) {
        // set registerInitiated as true
        setRegisterInitiated(true);
      }
      console.log(registerInitiated)
    } catch (e) {
      console.log(e);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpError("");
  };

  const handleOtpSubmit = async (e) => {
    // handle otp submit and final verification form
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/verify-otp`, {
        method: "POST",
        body: JSON.stringify({ email: registeredEmail, otp }),
        headers: {
          "Content-Type": "application/json",
        }
      });

      const responseData = await response.json();
      if (response.ok) {
        // if otp matches navigate to profile
        console.log("OTP verified successfully:", responseData.message);
        navigate("users/profile");
      } else {
        setOtpError(responseData.message || "OTP verification failed");
      }
    } catch (e) {
      console.error("Error during OTP verification:", e);
      setOtpError("An error occurred while verifying OTP");
    }
  };

  const handleResendOtp = async (e) => {
    // resend otp handler
    e.preventDefault();
    try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/register`, {
      method: "POST",
      body: formData,
    });
      if (response.ok) {
        console.log("OTP resend successfully:");
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div
      className="register-form-container bg-white p-16 text-black"
    >
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="register-form-container"
      >
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

        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            {...register("fullname", { required: "Full Name is required" })}
            placeholder="Enter your full name"
            autoComplete="off"
          />
          {errors.fullname && <span className="error">{errors.fullname.message}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
            })}
            placeholder="Enter your email"
            autoComplete="off"
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
            })}
            placeholder="Enter your password"
            autoComplete="off"
          />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) => value === watch("password") || "Passwords do not match",
            })}
            placeholder="Confirm your password"
            autoComplete="off"
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
        </div>

        {/* Profile Image */}
        <div className="form-group">
          <label htmlFor="profileImage">Profile Image</label>
          <input
            type="file"
            id="profileImage"
            {...register("profileImage", { required: "Profile Image is required" })}
            accept="image/*"
          />
          {errors.profileImage && <span className="error">{errors.profileImage.message}</span>}
        </div>

        {/* Submit Button */}
        <div className="register-form-submit-container w-full flex gap-2 justify-end">
          <button
            type="submit"
            disabled={registerInitiated}
            className={registerInitiated ? "disabled-button" : ""}
          >
            Register
          </button>
        </div>
      </form>

      {registerInitiated && (
        <div>
          {/* OTP Form */}
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
              <button onClick={handleResendOtp}>Resend Otp</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
