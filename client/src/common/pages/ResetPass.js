import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import logo from "../../assets/optiven-logo-full.png";

const ResetPass = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
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
      const response = await axios.post("/api/reset-password", {
        code,
        password,
      });

      if (response.data.message === "Password reset successful") {
        toast.success("Password reset successful. You can now login with your new password.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error resetting password. Please try again later.", {
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
      <form onSubmit={handleSubmit} className="form-control w-full max-w-xs">
      <img src={logo} alt="logo" />
      <label htmlFor="password" className="label">
        <span className="label-text font-bold">New Password</span>
      </label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="New Password"
        className="input input-bordered w-full max-w-xs"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    
      <label htmlFor="confirmPassword" className="label">
        <span className="label-text font-bold">Confirm New Password</span>
      </label>
      <input
        type="password"
        id="confirmPassword"
        name="confirmPassword"
        placeholder="Confirm New Password"
        className="input input-bordered w-full max-w-xs"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
    
        <button
          type="submit"
          className="btn btn-primary w-full max-w-xs mt-4 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPass;
