import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");
};

const EditScheduledInterviews = () => {
  const { id } = useParams();
  const interviewId = id;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [interview_date, setInterviewDate] = useState("");
  const [interview_time, setInterviewTime] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchInterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInterview = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/interviews/${interviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setName(data.name);
      setEmail(data.email);
      setPhoneNumber(data.phone_number);
      setInterviewDate(data.interview_date);
      setInterviewTime(data.interview_time);
      setPosition(data.position);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const interviewData = {
      name,
      email,
      phone_number,
      interview_date: formatDate(interview_date),
      interview_time,
      position,
    };
    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/interviews/${interviewId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(interviewData),
        }
      );

      const data = await response.json();
      // Display success notification
      toast.success(data.message, {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
      navigate("/view-interviews");
    } catch (error) {
      // Display error notification
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <div className="flex flex-col items-center my-5">
        <div className="max-w-lg mx-auto">
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link to="/visitors-management">Home</Link>
              </li>
              <li>
                <Link to="/view-interviews">View Interviews</Link>
              </li>
              <li>Edit Interview</li>
            </ul>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="name" className="label font-bold text-sm">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="label font-bold text-sm">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="phone_number" className="label font-bold text-sm">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone_number"
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="interview_date"
                className="label font-bold text-sm"
              >
                Interview Date
              </label>
              <input
                type="date"
                id="interview_date"
                value={formatDate(interview_date)}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="interview_time"
                className="label font-bold text-sm"
              >
                Interview Time
              </label>
              <input
                type="time"
                id="interview_time"
                value={interview_time}
                onChange={(e) => setInterviewTime(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="position" className="label font-bold text-sm">
                Position
              </label>
              <input
                type="text"
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-outline w-full"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </Sidebar>
  );
};

export default EditScheduledInterviews;
