import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import formatDate from "../../utils/formatDate";

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
      <div className="mb-10">
        <div className="mx-10 my-5">
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link to="/workplan-home">Home</Link>
              </li>
              <li>View Workplans</li>
            </ul>
          </div>
        </div>
        <div className="mx-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {workplans.map((workplan) => (
            <div
              id={workplan.id}
              onClick={() => handleClick(workplan.id)}
              className="card shadow-xl cursor-pointer"
            >
              <div className="card-body">
                <label className="label font-bold text-xs">Start Date</label>
                <span className="font-bold text-primary">
                  {formatDate(workplan.start_date)}
                </span>
                <label className="label font-bold text-xs">End Date</label>
                <span className="font-bold text-error">
                  {formatDate(workplan.end_date)}
                </span>
                <button className="btn">Open</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
};

export default ViewWorkPlans;
