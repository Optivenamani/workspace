import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const ScheduleInterview = () => {
  const [interviewees, setInterviewees] = useState([
    {
      name: "",
      email: "",
      phone_number: "",
      interview_date: "",
      interview_time: "",
      position: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();

  const handleInputChange = (event, intervieweeIndex, field) => {
    const { value } = event.target;
    setInterviewees(prevInterviewees => {
      const updatedInterviewees = [...prevInterviewees];
      updatedInterviewees[intervieweeIndex] = {
        ...updatedInterviewees[intervieweeIndex],
        [field]: value
      };
      return updatedInterviewees;
    });
  };
  const handleAddInterviewee = () => {
    setInterviewees([
      ...interviewees,
      {
        name: "",
        email: "",
        phone_number: "",
        interview_date: "",
        interview_time: "",
        position: "",
      },
    ]);
  };

  const handleRemoveInterviewee = (index) => {
    const intervieweesCopy = [...interviewees];
    intervieweesCopy.splice(index, 1);
    setInterviewees(intervieweesCopy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateInterviewees();
    if (!isValid) {
      return;
    }
    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      const response = await fetch("http://localhost:8080/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(interviewees),
      });

      const data = await response.json();
      console.log(data);
      setLoading(false);
      navigate("/view-interviews");

      // Display success notification
      toast.success("Interview(s) scheduled successfully!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Reset form fields
      setInterviewees([
        {
          name: "",
          email: "",
          phone_number: "",
          interview_date: "",
          interview_time: "",
          position: "",
        },
      ]);
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

  const validateInterviewees = () => {
    for (const interviewee of interviewees) {
      if (
        !interviewee.name ||
        !interviewee.email ||
        !interviewee.phone_number ||
        !interviewee.interview_date ||
        !interviewee.interview_time ||
        !interviewee.position
      ) {
        setError("Please fill in all required fields.");
        return false;
      }
      if (!isValidEmail(interviewee.email)) {
        setError("Please enter a valid email address.");
        return false;
      }
      if (!isValidPhone(interviewee.phone_number)) {
        setError("Please enter a valid phone number.");
        return false;
      }
    }
    setError("");
    return true;
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
                src="https://images.unsplash.com/photo-1618565917118-723caea78e02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
                alt="interview-banner"
                className="absolute top-0 left-0 h-full w-full object-cover"
              />
            </section>

            <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-8 xl:col-span-6">
              <div className="max-w-xl lg:max-w-3xl">
                <div className="text-sm breadcrumbs">
                  <ul>
                    <li>
                      <Link to="/visitors-management">Home</Link>
                    </li>
                    <li>Schedule Interview</li>
                  </ul>
                </div>
                <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
                  {interviewees.map((interviewee, index) => (
                    <div key={index} className="col-span-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor={`name_${index}`} className="label">
                            <span className="label-text font-bold">Name</span>
                          </label>
                          <input
                          type="text"
                          id={`name_${index}`}
                          name={`interviewee_${index}_name`}
                          value={interviewee.name}
                          onChange={(event) => handleInputChange(event, index, "name")}
                          className="input input-bordered w-full max-w-xs"
                          required
                        />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor={`email_${index}`} className="label">
                            <span className="label-text font-bold">Email</span>
                          </label>
                          <input
                            type="email"
                            id={`email_${index}`}
                            name={`interviewee_${index}_email`}
                            value={interviewee.email}
                            onChange={(event) => handleInputChange(event, index, "email")}
                            className="input input-bordered w-full max-w-xs"
                            required
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor={`phone_number_${index}`} className="label">
                            <span className="label-text font-bold">Phone</span>
                          </label>
                          <input
                            type="tel"
                            id={`phone_number_${index}`}
                            name={`interviewee_${index}_phone_number`}
                            value={interviewee.phone_number}
                            onChange={(event) => handleInputChange(event, index, "phone_number")}
                            className="input input-bordered w-full max-w-xs"
                            required
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor={`interview_date_${index}`} className="label">
                            <span className="label-text font-bold">Interview Date</span>
                          </label>
                          
                          <input
                          type="date"
                          id={`interview_date_${index}`}
                          name={`interviewee_${index}_interview_date`}
                          value={interviewee.interview_date}
                          onChange={(event) => handleInputChange(event, index, "interview_date")}
                          className="input input-bordered w-full max-w-xs"
                          required
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor={`interview_time_${index}`} className="label">
                            <span className="label-text font-bold">Interview Time</span>
                          </label>
                          <input
                            type="time"
                            id={`interview_time_${index}`}
                            name={`interviewee_${index}_interview_time`}
                            value={interviewee.interview_time}
                            onChange={(event) => handleInputChange(event, index, "interview_time")}
                            className="input input-bordered w-full max-w-xs"
                            required
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor={`position_${index}`} className="label">
                            <span className="label-text font-bold">Position</span>
                          </label>
                          <input
                            type="text"
                            id={`position_${index}`}
                            name={`interviewee_${index}_position`}
                            value={interviewee.position}
                            onChange={(event) => handleInputChange(event, index, "position")}
                            className="input input-bordered w-full max-w-xs"
                            required
                          />
                        </div>

                        {interviewees.length > 1 && (
                          <div className="col-span-6 sm:col-span-3 mt-4">
                            <button
                              type="button"
                              onClick={() => handleRemoveInterviewee(index)}
                              className="btn btn-error"
                            >
                              Delete Interviewee
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
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
                <button
                  onClick={handleAddInterviewee}
                  className="btn btn-primary btn-outline mx-2 my-4 lg:max-w-xs"
                >
                  Add Another Interviewee
                </button>
              </div>
            </main>
          </div>
        </section>
      </Sidebar>
    </>
  );
};

export default ScheduleInterview;
