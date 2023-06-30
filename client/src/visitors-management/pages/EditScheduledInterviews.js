import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";

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

const formatTime = (timeString) => {
  if (!timeString) return null;
  const time = new Date(`1970-01-01T${timeString}`);
  return time.toISOString().substr(11, 5);
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
        `http://localhost:8080/api/interviews/${interviewId}`,
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
      interview_date,
      interview_time,
      position,
    };
    try {
      const response = await fetch(
        `http://localhost:8080/api/interviews/${interviewId}`,
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
      setLoading(false);
      navigate("/view-interviews");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <div className="container px-4 py-6 mx-auto">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">Edit Scheduled Interview</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block font-bold mb-1">
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
            <div className="mb-4">
              <label htmlFor="email" className="block font-bold mb-1">
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
            <div className="mb-4">
              <label htmlFor="phone_number" className="block font-bold mb-1">
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
            <div className="mb-4">
              <label htmlFor="interview_date" className="block font-bold mb-1">
                Interview Date
              </label>
              <input
                type="date"
                id="interview_date"
                value={interview_date}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="interview_time" className="block font-bold mb-1">
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
            <div className="mb-4">
              <label htmlFor="position" className="block font-bold mb-1">
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
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Sidebar>
  );
};

export default EditScheduledInterviews;
