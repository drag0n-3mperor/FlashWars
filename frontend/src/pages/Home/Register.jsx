import { useForm } from "react-hook-form";

export function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    await fetch(`${import.meta.env.BACKEND_URL}/register`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="register-form-container bg-white p-16 text-black"
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
              minLength: { value: 6, message: "Password must be at least 6 characters long" },
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
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}
