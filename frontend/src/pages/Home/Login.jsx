import { useForm } from "react-hook-form";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Login Data:", data);
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div>
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
    </div>
  );
}
