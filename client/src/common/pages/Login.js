import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/optiven-logo-full.png";
import { ToastContainer, toast } from "react-toastify";
// redux
import { useDispatch } from "react-redux";
import {
  setUser,
  setToken,
  setAccessRole,
} from "../../redux/logistics/features/user/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://workspace.optiven.co.ke/api/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // console.log("User successfully logged in", response.data);

      dispatch(setUser(response.data.user));
      dispatch(setToken(response.data.token));
      dispatch(setAccessRole(response.data.user["Accessrole"]));
      // redirect to home page
      navigate("/");
    } catch (error) {
      console.error(error.response.data);
      // Check if the error is a validation error
      if (error.response.data.errors) {
        // Loop over the errors array and display each error message
        error.response.data.errors.forEach((err) => {
          toast.error(err.msg, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
      } else {
        // If it's not a validation error, display the error message
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="hero min-h-screen">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="form-control w-full max-w-xs">
        <img src={logo} alt="logo" />
        <label htmlFor="email" className="label">
          <span className="label-text font-bold">Email</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="name@domain"
          className="input input-bordered w-full max-w-xs"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password" className="label">
          <span className="label-text font-bold">Password</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="******"
          className="input input-bordered w-full max-w-xs"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          id="submit"
          className="btn btn-primary w-full max-w-xs mt-4 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Login"}
        </button>
        <label htmlFor="password" className="label">
          <a
            href="http://localhost:3000/forgot-pass"
            className="label-text font-bold text-green-600 italic hover:underline"
          >
            Forgot Password?
          </a>
        </label>
      </form>
    </div>
  );
};

export default Login;
