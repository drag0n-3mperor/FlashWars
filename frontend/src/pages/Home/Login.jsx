import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const {
    register, handleSubmit, formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Login Data:", data);
    try {
      // post login form
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
        method: "POST", body: JSON.stringify(data), headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(await response.json().message);
      if (response.ok) {
        //navigate to profile if successful
        navigate("/users/profile");
      }
    } catch (e) {
      // catch any error if it has occurred
      console.log(e);
    }
  };

  return (<div>
    {/* Login Form */}
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="login-form-container bg-white p-16 text-black"
    >
      <div className="form-group">
        <label htmlFor="uid">Email or Username</label>
        <input
          type="text"
          id="email"
          {...register("email", { required: "Email is required" })}
          placeholder="Enter your email"
          autoComplete="off"
        />
        {errors.uid && <span className="error">{errors.uid.message}</span>}
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
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>
      <div className="login-form-submit-container w-full flex gap-2 justify-end">
        <button type="submit">Login</button>
      </div>
    </form>
  </div>);
}
