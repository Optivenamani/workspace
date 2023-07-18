import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CreateWorkPlan = () => {
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.user.token);
  const marketerId = useSelector((state) => state.user.user.user_id);

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
    fetch("https://workspace.optiven.co.ke/api/workplans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(workplan),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLoading(false);
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
        toast.error("An error occurred. Please try again.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
