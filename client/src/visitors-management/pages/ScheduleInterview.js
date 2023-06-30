import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const ScheduleInterview = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [interview_date, setInterviewDate] = useState("");
  const [interview_time, setInterviewTime] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone_number || !interview_date || !interview_time || !position) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!isValidPhone(phone_number)) {
      setError("Please enter a valid phone number.");
      return;
    }
    setLoading(true);
    setError(""); // Clear any previous errors
    const interviewData = {
      name,
      email,
      phone_number,
      interview_date,
      interview_time,
      position,
    };
    try {
      const response = await fetch("http://localhost:8080/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(interviewData),
      });

      const data = await response.json();
      console.log(data);
      setLoading(false);
      navigate("/view-interviews");

      // Display success notification
      toast.success("Interview scheduled successfully!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Reset form fields
      setName("");
      setEmail("");
      setPhoneNumber("");
      setInterviewDate("");
      setInterviewTime("");
      setPosition("");
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("An error occurred. Please try again."); // Update error message

      // Display error notification
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const isValidEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone_number) => {
    // Basic phone number validation (digits and dashes)
    const phoneRegex = /^\d+(-\d+)*$/;
    return phoneRegex.test(phone_number);
  };

  return (
    <>
      <Sidebar>
        <section className="bg-white">
          <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
            <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
              <img
                src="https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
                alt="Sidebar Image"
                className="absolute top-0 left-0 h-full w-full object-cover"
              />
              {/* Sidebar content */}
            </section>

            <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-8 xl:col-span-6">
              <div className="max-w-xl lg:max-w-3xl">
                <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="name" className="label">
                      <span className="label-text font-bold">Name</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      placeholder="John Smith"
                      onChange={(event) => setName(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="email" className="label">
                      <span className="label-text font-bold">Email</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="example@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="phone_number" className="label">
                      <span className="label-text font-bold">Phone</span>
                    </label>
                    <input
                      type="tel"
                      id="phone_number"
                      placeholder="07XXXXXXXX"
                      value={phone_number}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="interview_date" className="label">
                      <span className="label-text font-bold">Interview Date</span>
                    </label>
                    <input
                      type="date"
                      id="interview_date"
                      value={interview_date}
                      onChange={(event) => setInterviewDate(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="interview_time" className="label">
                      <span className="label-text font-bold">Interview Time</span>
                    </label>
                    <input
                      type="time"
                      id="interview_time"
                      value={interview_time}
                      onChange={(event) => setInterviewTime(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="position" className="label">
                      <span className="label-text font-bold">Position</span>
                    </label>
                    <input
                      type="text"
                      id="position"
                      placeholder="Job position"
                      value={position}
                      onChange={(event) => setPosition(event.target.value)}
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <button
                      type="submit"
                      className="btn btn-primary mt-4 w-full max-w-xs"
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Schedule Interview"}
                    </button>
                  </div>
                </form>
              </div>
            </main>
          </div>
        </section>
      </Sidebar>
    </>
  );
};

export default ScheduleInterview;
