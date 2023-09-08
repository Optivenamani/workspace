import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import { useParams, useNavigate, Link } from "react-router-dom";

const WorkplanDetails = () => {
  const [workplan, setWorkplan] = useState({});
  const [activities, setActivities] = useState([]);
  const { id } = useParams();
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch workplan details from the server based on the id parameter
    const fetchWorkplanDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/workplans/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setWorkplan(data);

        // Fetch workplan activities for the workplan
        const activitiesResponse = await fetch(
          `http://localhost:8080/api/workplans/${id}/details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData.activities);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch workplan details. Please try again.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // Redirect back to the workplans list if there's an error
        navigate("/approve-workplans");
      }
    };

    fetchWorkplanDetails();
  }, [token, id, navigate]);

  const handleApprove = async () => {
    try {
      // Make a POST request to approve the workplan
      const response = await fetch(
        `http://localhost:8080/api/workplans/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("workplan approved:", data);
      toast.success("Workplan approved successfully!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Redirect back to the workplans list
      navigate("/approve-workplans");
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve the workplan. Please try again.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleReject = async () => {
    try {
      // Make a POST request to reject the workplan
      const response = await fetch(
        `http://localhost:8080/api/workplans/${id}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("workplan rejected:", data);
      toast.success("Workplan rejected successfully!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Redirect back to the workplans list
      navigate("/approve-workplans");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject the workplan. Please try again.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Sidebar>
      <h2>Workplan Details</h2>
      <div>
        <p>Start Date: {workplan.start_date}</p>
        <p>End Date: {workplan.end_date}</p>
        {/* Add more details about the workplan here */}
      </div>

      <h3>Activities</h3>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            <p>Title: {activity.title}</p>
            <p>Expected Output: {activity.expected_output}</p>
            <p>Date: {activity.date}</p>
            <p>Time: {activity.time}</p>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={handleApprove}>Approve</button>
        <button onClick={handleReject}>Reject</button>
      </div>
      <Link to="/workplans">Back to Workplans</Link>
    </Sidebar>
  );
};

export default WorkplanDetails;
