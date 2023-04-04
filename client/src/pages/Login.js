import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/optiven-logo-full.png";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("User successfully logged in", response.data);
      // redirect to home page
      navigate("/");
    } catch (error) {
      console.error(error.response.data);
      toast.error(error.response.data, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
        <label htmlFor="submit" className="label">
          <span className="label-text font-bold">&nbsp;</span>
        </label>
        <button
          type="submit"
          id="submit"
          className="btn btn-primary w-full max-w-xs"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Login;
