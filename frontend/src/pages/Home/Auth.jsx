import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LoaderComponent } from "../../components/LoaderComponent";
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, setIsAuthenticated, setUser, user } = useAuth();
  const navigate = useNavigate();
  const [registerInitiated, setRegisterInitiated] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState(null);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpMsg, setOtpMsg] = useState(null);
  const [loginMsg, setLoginMsg] = useState(null);
  const [registerMsg, setRegisterMsg] = useState(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isLogin) {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/login`,
          data,
          { withCredentials: true }
        );

        // console.log(response);
        if (response.status === 201) {
          setIsAuthenticated(true); // Update authentication state

          // Fetch user profile after login
          const profileResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/users/profile`,
            { withCredentials: true }
          );
          // console.log("User Profile:", profileResponse.data);
          setUser(profileResponse.data); // Update the user in context

          // Navigate to profile page
          navigate("/profile");
        } else {
          setLoginMsg({
            success: false,
            message: response.data?.message,
          });
        }
      } else {
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
        } else {
          setRegisterMsg({
            success: false,
            message: response.data?.message,
          });
        }
      }
    } catch (e) {
      // console.error("Login error:", e);
      if (isLogin) {
        setLoginMsg({
          success: false,
          message: e.response?.data?.message,
        });
      } else {
        setRegisterMsg({
          success: false,
          message: e.response?.data?.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/register`,
        formData,
        {
          withCredentials: true,
        }
      );
      // console.log("OTP resent successfully");
      setOtpMsg({
        success: true,
        message: "Otp resend successfully",
      });
    } catch (e) {
      // console.error("Error during OTP verification:", e);
      setOtpMsg({
        success: false,
        message: e.response?.data?.message || "Error during OTP verification:",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpMsg(null);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      return setOtpMsg({
        success: false,
        message: "OTP must be 6 digits",
      });
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/verify-otp`,
        { email: registeredEmail, otp },
        { withCredentials: true }
      );

      if (response.status === 201) {
        // console.log("OTP verified successfully");
        setIsAuthenticated(true); // Update authentication state
        navigate("/profile");
      } else {
        setOtpMsg({
          success: false,
          message: response.data.message,
        });
      }
    } catch (e) {
      // console.error("Error during OTP verification:", e);
      setOtpMsg({
        success: false,
        message:
          e.response?.data?.message || "An error occurred while verifying OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      setLoginMsg(null);
      setRegisterMsg(null);
      setOtpMsg(null);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <LoaderComponent />
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <>User Already logged in</>
      ) : (
        <div className="bg-gray-200 flex items-center justify-center min-h-screen">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
            {isLogin ? (
              <>
                {/* Login Form */}
                <div className="w-full md:w-1/2 p-8">
                  {loginMsg && (
                    <div
                      className={`p-4 mb-4 ${
                        loginMsg.success
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {loginMsg.message}
                    </div>
                  )}
                  <h2 className="text-2xl font-bold mb-6">Signin</h2>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                      <input
                        {...register("email", {
                          required: "Username is required",
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        type="text"
                        placeholder="Username"
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.username.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <input
                        {...register("password", {
                          required: "Password is required",
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        type="password"
                        placeholder="Password"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700"
                        disabled={loading}
                      >
                        Signin
                      </button>
                    </div>
                  </form>
                </div>

                {/* Welcome Message */}
                <div className="w-full md:w-1/2 bg-blue-500 text-white p-8 flex flex-col justify-center items-center">
                  <h2 className="text-2xl font-bold mb-4">Welcome back!</h2>
                  <p className="mb-4 text-center">
                    We are so happy to have you here again!
                  </p>
                  <button
                    onClick={() => setIsLogin(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full"
                  >
                    No account yet? Signup.
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Signup Welcome Panel */}
                <div className="bg-blue-500 text-white p-8 md:w-1/2 flex flex-col justify-center items-center">
                  <h2 className="text-3xl font-bold mb-4">Come join us!</h2>
                  <p className="text-center mb-6">
                    Create an account to get exclusive offers!
                  </p>
                  <button
                    onClick={() => setIsLogin(true)}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-full"
                  >
                    Already have an account? Signin.
                  </button>
                </div>

                {/* Signup Form */}
                <div className="p-8 md:w-1/2">
                  <h2 className="text-3xl font-bold mb-6">Signup</h2>
                  {registerMsg && (
                    <div
                      className={`p-4 mb-4 ${
                        registerMsg.success
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {registerMsg.message}
                    </div>
                  )}
                  {/* OTP Verification Form */}
                  {!registerInitiated ? (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <input
                        {...register("fullname", {
                          required: "Full name is required",
                        })}
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-3 mb-4 border rounded-lg"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm">
                          {errors.fullName.message}
                        </p>
                      )}

                      <input
                        {...register("username", {
                          required: "Username is required",
                        })}
                        type="text"
                        placeholder="Username"
                        className="w-full p-3 mb-4 border rounded-lg"
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm">
                          {errors.username.message}
                        </p>
                      )}

                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email address",
                          },
                        })}
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 mb-4 border rounded-lg"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}

                      <input
                        {...register("password", {
                          required: "Password is required",
                        })}
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 mb-4 border rounded-lg"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password.message}
                        </p>
                      )}

                      <input
                        {...register("confirmPassword", {
                          required: "Confirm Password is required",
                          validate: (value) =>
                            value === watch("password") ||
                            "Passwords do not match",
                        })}
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full p-3 mb-4 border rounded-lg"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.confirmPassword.message}
                        </p>
                      )}

                      <div className="mb-4">
                        <label className="block mb-2 font-semibold">
                          Upload Profile Picture:
                        </label>
                        <input
                          {...register("profileImage")}
                          type="file"
                          className="w-full p-2 border rounded-lg"
                          accept="image/*"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg mb-4"
                        onClick={onSubmit}
                        disabled={loading}
                      >
                        Signup
                      </button>
                    </form>
                  ) : (
                    <form
                      onSubmit={handleOtpSubmit}
                      className="register-form-container"
                    >
                      {otpMsg && (
                        <div
                          className={`p-4 mb-4 ${
                            otpMsg.success
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {otpMsg.message}
                        </div>
                      )}
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
                      </div>
                      <div className="w-full flex gap-2 justify-end">
                        <button
                          type="submit"
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg mb-4"
                          disabled={loading}
                        >
                          Verify OTP
                        </button>
                        <button
                          onClick={handleResendOtp}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg mb-4"
                          disabled={loading}
                        >
                          Resend OTP
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
