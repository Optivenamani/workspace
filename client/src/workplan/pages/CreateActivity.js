import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateActivity = () => {
  const { id } = useParams();
  const workplanId = id;

  const [activities, setActivities] = useState([
    {
      workplan_id: parseInt(workplanId),
      title: "",
      date: "",
      time: "",
      expected_output: "",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();

  const handleActivityChange = (index, field, value) => {
    setActivities((prevActivities) => {
      const updatedActivities = [...prevActivities];
      updatedActivities[index] = {
        ...updatedActivities[index],
        [field]: value,
      };
      return updatedActivities;
    });
  };

  const addActivityField = () => {
    setActivities((prevActivities) => [
      ...prevActivities,
      {
        workplan_id: parseInt(workplanId),
        title: "",
        date: "",
        time: "",
        expected_output: "",
      },
    ]);
  };

  const removeActivityField = (index) => {
    setActivities((prevActivities) => {
      const updatedActivities = [...prevActivities];
      updatedActivities.splice(index, 1);
      return updatedActivities;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(activities);
    try {
      const activityData = activities.map((activity) => ({
        ...activity,
      }));

      console.log(JSON.stringify(activityData));

      const response = await fetch(
        "https://workspace.optiven.co.ke/api/workplan-activities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(activityData),
        }
      );

      if (!response.ok) {
        throw new Error("An error occurred while adding activities.");
      }

      setLoading(false);
      navigate("/view-activities");

      // Display success notification
      toast.success("Activities added successfully!", {
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
    <Sidebar>
      <div className="mb-10">
        <div className="mx-10 my-5">
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link to="/workplan-home">Home</Link>
              </li>
              <li>
                <Link to="/view-workplans">View Workplans</Link>
              </li>
              <li>Add Activities</li>
            </ul>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mx-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activities.map((activity, index) => (
              <div key={index} className="card bg-base-100 shadow-xl p-4">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeActivityField(index)}
                    className="btn btn-sm btn-circle btn-ghost btn-error absolute right-2 top-2"
                  >
                    ✕
                  </button>
                )}
                <div>
                  <label className="label font-bold text-xs">Title</label>
                  <select
                    name="title"
                    value={activity.title}
                    onChange={(e) =>
                      handleActivityChange(index, "title", e.target.value)
                    }
                    required
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Activity</option>
                    <option value="Activation">Activation</option>
                    <option value="Make Cold Calls">Make Cold Calls</option>
                    <option value="Make Follow Up Calls">
                      Make Follow Up Calls
                    </option>
                    <option value="Social Media Engagements">
                      Social Media Engagements
                    </option>
                    <option value="Send Emails">Send Emails</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Site Visit">Site Visit</option>
                  </select>

                  <div>
                    <div>
                      <label className="label font-bold text-xs">Date</label>
                      <input
                        className="input input-bordered w-full"
                        type="date"
                        name="date"
                        value={activity.date}
                        onChange={(e) =>
                          handleActivityChange(index, "date", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="label font-bold text-xs">Time</label>
                      <input
                        className="input input-bordered w-full"
                        type="time"
                        name="time"
                        value={activity.time}
                        onChange={(e) =>
                          handleActivityChange(index, "time", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <label className="label font-bold text-xs">
                    Expected Output
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    name="expected_output"
                    value={activity.expected_output}
                    onChange={(e) =>
                      handleActivityChange(
                        index,
                        "expected_output",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={addActivityField}
              className="btn btn-primary btn-circle text-white"
            >
              +
            </button>
            <button type="submit" className="btn btn-outline ml-4">
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </Sidebar>
  );
};

export default CreateActivity;
