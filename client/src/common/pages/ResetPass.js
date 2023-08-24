import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import logo from "../../assets/optiven-logo-full.png";
import "react-toastify/dist/ReactToastify.css"; // Make sure to import the toast styles

const ResetPass = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const emailParam = queryParams.get("email");
    if (emailParam) {
      setUserEmail(emailParam);
    }
  }, []);

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
      const response = await axios.post(`http://localhost:8080/api/reset-password?email=${userEmail}`, {
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

        <p className="text-center text-sm mt-2 text-gray-600">
          Resetting password for: {userEmail}
        </p>

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
