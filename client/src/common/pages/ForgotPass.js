import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/optiven-logo-full.png";
import { ToastContainer, toast } from "react-toastify";

const ForgotPass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
  
    // Check if the email is from @optiven.co.ke domain
    if (!email.endsWith("@optiven.co.ke")) {
      toast.error("Please enter a valid email from @optiven.co.ke domain", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/forgot-password", {
        email,
      });

      if (response.data.message === "Email not found") {
        toast.error("Email not found. Please enter a valid email.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (response.data.message === "Password reset email sent") {
        toast.success("Password reset email sent!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending reset email.", {
        position: "top-center",
        autoClose: 3000,
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
      <form
        onSubmit={handleSubmit}
        className="form-control w-full max-w-xs"
      >
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
          onChange={(e) => {
            setEmail(e.target.value)
            localStorage.setItem("reset-email-pass", email)
          }}
          required
        />

        <button
          type="submit"
          id="submit"
          className="btn btn-primary w-full max-w-xs mt-4 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Email"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPass;
