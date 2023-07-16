import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

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
      target: "",
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
        target: "",
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
        "http://localhost:8080/api/workplan-activities",
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
      alert("Activities added successfully!");
    } catch (error) {
      alert(error);
      setLoading(false);

      // Display error notification
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Sidebar>
      <div>
        <div>
          <ul>
            <li>
              <Link to="/workplan-home">Home</Link>
            </li>
            <li>
              <Link to="/view-workplans">View Workplans</Link>
            </li>
            <li>Create Task</li>
          </ul>
        </div>
        <form onSubmit={handleSubmit}>
          {activities.map((activity, index) => (
            <div key={index}>
              <div>
                <label>Title</label>
                <select
                  name="title"
                  value={activity.title}
                  onChange={(e) =>
                    handleActivityChange(index, "title", e.target.value)
                  }
                  required
                >
                  <option value="">Select Activity</option>
                  <option key={1} value="test 1">
                    Test
                  </option>
                </select>
                <div>
                  <div>
                    <label>Date</label>
                    <input
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
                    <label>Time</label>
                    <input
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
                <label>Expected Output</label>
                <textarea
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
                <label>Target</label>
                <textarea
                  type="text"
                  name="target"
                  value={activity.target}
                  onChange={(e) =>
                    handleActivityChange(index, "target", e.target.value)
                  }
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeActivityField(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          <button type="submit">{loading ? "Creating" : "Create"}</button>
          <button type="button" onClick={addActivityField}>
            Add Activity
          </button>
        </form>
      </div>
    </Sidebar>
  );
};

export default CreateActivity;
