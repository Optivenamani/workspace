import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = useSelector((state) => state.user.user.user_id);
  const fullnames = useSelector((state) => state.user.user.fullnames);
  const token = useSelector((state) => state.user.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const feedbackData = {
      user_id: userId,
      name: fullnames,
      feedback: feedback,
    };
    try {
      const response = await fetch(
        "https://workspace.optiven.co.ke/api/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(feedbackData),
        }
      );

      const responseData = await response.json();
      console.log(responseData);
      setLoading(false);
      navigate("/");
      // Display success notification
      toast.success("Feedback sent!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      // Display error notification
      toast.error(error, {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold">
            🎯 Your Feedback, Your Impact! 🎯
          </h1>
          <p className="py-6 text-start">
            Your insights are the secret sauce to our system's success! 🌟So,
            don't hold back—tell us what you love, what you loathe, and anything
            in between. We're all ears and excited to make this system the best
            version it can be! 🚀
          </p>
          <p className="text-start">Looking forward to hearing from you,</p>
          <p className="text-start font-bold mb-2">- The ICT Team 📱</p>
          <textarea
            className="textarea textarea-bordered h-48 w-full mb-1"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="This system rocks!"
          />
          <button
            className="btn btn-outline w-full lg:w-1/2"
            onClick={handleSubmit}
          >
            {loading ? "Submitting" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
