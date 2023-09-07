import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const CreateWorkPlan = () => {
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.user.token);
  const marketerId = useSelector((state) => state.user.user.user_id);
  console.log(marketerId);
  const navigate = useNavigate();

  const [workplan, setWorkplan] = useState({
    start_date: "",
    end_date: "",
    marketer_id: marketerId,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkplan((prevWorkplan) => ({
      ...prevWorkplan,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get the current date
    const currentDate = new Date().toISOString().split("T")[0];

    // Check if the selected start_date is in the past
    if (workplan.start_date < currentDate) {
      toast.error("You cannot create a workplan for a past date.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return; // Prevent further execution
    }
    
    fetch("https://workspace.optiven.co.ke/api/workplans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(workplan),
    })
      .then((response) => {
        if (!response.ok) {
          // If the response status is not ok, check for specific error messages
          return response.json().then((data) => Promise.reject(data));
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setLoading(false);
        navigate("/view-workplans");
        toast.success("Work plan created successfully!", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        if (error.status === 409) {
          // Handling the specific error for duplicate workplan within the same week
          toast.error(
            "You have already created a workplan that exists in this date range.",
            {
              position: "top-center",
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            }
          );
        } else {
          toast.error("An error occurred. Please try again later.", {
            position: "top-center",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      });
  };

  return (
    <Sidebar>
      <form onSubmit={handleSubmit}>
        <div className="hero min-h-screen">
          <div className="form-control w-full max-w-xs">
            <div className="text-sm breadcrumbs">
              <ul>
                <li>
                  <Link to="/workplan-home">Home</Link>
                </li>
                <li>Create Workplan</li>
              </ul>
            </div>
            <div>
              <label className="label font-bold text-sm">Start Date:</label>
              <input
                type="date"
                name="start_date"
                value={workplan.start_date}
                onChange={handleChange}
                required
                className="input input-bordered w-full max-w-xs"
              />
            </div>
            <div>
              <label className="label font-bold text-sm">End Date:</label>
              <input
                type="date"
                name="end_date"
                value={workplan.end_date}
                onChange={handleChange}
                required
                className="input input-bordered w-full max-w-xs mb-4"
              />
            </div>
            <button type="submit" className="btn btn-outline">
              {loading ? "Submitting..." : "Create Workplan"}
            </button>
          </div>
        </div>
      </form>
    </Sidebar>
  );
};

export default CreateWorkPlan;
