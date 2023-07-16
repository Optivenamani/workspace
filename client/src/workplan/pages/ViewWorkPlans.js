import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewWorkPlans = () => {
  const [workplans, setWorkplans] = useState([]);
  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch visitor data from the server
    const fetchWorkPlans = async () => {
      try {
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/workplans",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Workplans:", data); // Debugging statement

        // Update visitors state only if the response data is an array
        if (Array.isArray(data)) {
          setWorkplans(data);
        } else {
          console.error("Invalid response format. Expected an array.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWorkPlans();
  }, [token]);

  const handleClick = (workplanId) => {
    navigate(`/view-workplans/${workplanId}`);
  };

  return (
    <Sidebar>
      <div>ViewWorkPlans</div>
      <div>
        {workplans.map((workplan) => (
          <div id={workplan.id} onClick={() => handleClick(workplan.id)}>
            {workplan.start_date}
          </div>
        ))}
      </div>
    </Sidebar>
  );
};

export default ViewWorkPlans;
