import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import logo from "../../assets/optiven-logo-full.png";
import "react-toastify/dist/ReactToastify.css";

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

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setIsSubmitting(true);

  //   if (password !== confirmPassword) {
  //     toast.error("Passwords do not match", {
  //       position: "top-center",
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //     setIsSubmitting(false);
  //     return;
  //   }

  //   try {
  //     console.log("Sending Axios request...");
  //     const apiUrl = `http://localhost:8080/api/reset-pass`;

  //     const url = new URL(window.location.href);
  //     const queryParams = new URLSearchParams(url.search);
  //     const code = queryParams.get("code");
  //     // const email = localStorage.getItem("reset-email-pass")
  //     const requestData = {
  //       email: 'developer@optiven.co.ke',
  //       code: '1e9d1d8b4bdca3816ed519d0e26decb29d613812', // assuming "code" is the code extracted from the URL
  //       password: 'test' // assuming "password" is the new password entered by the user
  //     };

  //     console.log("API URL:", apiUrl);
  //     console.log("Request Data:", requestData);

  //     const response = await axios.post(apiUrl, requestData);
  //     console.log("Axios Response:", response.data);

  //     if (response.data.message === "Password reset successful") {
  //       console.log("Password reset successful");
  //       toast.success("Password reset successful. You can now login with your new password.", {
  //         position: "top-center",
  //         autoClose: 3000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       });
  //       navigate("/login");
  //     }
  //   } catch (error) {
  //     console.error("Axios Error:", error);
  //     toast.error("Error resetting password. Please try again later.", {
  //       position: "top-center",
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //     });
  //   }

  //   setIsSubmitting(false);
  // };

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
      console.log("Sending Axios request...");
      const apiUrl = `http://localhost:8080/api/reset-pass`;

            const url = new URL(window.location.href);
      const queryParams = new URLSearchParams(url.search);
      const code = queryParams.get("code");
      const email = localStorage.getItem("reset-email-pass")
  
      const requestData = {
        email: "developer@optiven.co.ke",
        code: code,
        password: password
      };
  
      console.log("API URL:", apiUrl);
      console.log("Request Data:", requestData);
  
      const response = await axios.post(apiUrl, requestData, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Axios Response:", response.data);
  
      if (response.data.message === "Password reset successful") {
        console.log("Password reset successful");
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
      console.error("Axios Error:", error);
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
