import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";

const ApproveWorkplans = () => {
  const [workplans, setWorkplans] = useState([]);
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user.user_id);

  useEffect(() => {
    // Fetch workplans data from the server
    const fetchPendingWorkplans = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/workplans/pending`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("workplans:", data); // Debugging statement
        setWorkplans(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch workplans. Please try again.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };

    fetchPendingWorkplans();
  }, [token, userId]);

  return (
    <Sidebar>
      <h2>Workplans List</h2>
      <ul>
        {Array.isArray(workplans) &&
          workplans.map((workplan) => (
            <Link to={`/workplan-details/${workplan.id}`} key={workplan.id}>
              {workplan.start_date} - {workplan.end_date}
            </Link>
          ))}
      </ul>
    </Sidebar>
  );
};

export default ApproveWorkplans;
