import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


const Workplans = ({ token }) => {
  const [workPlans, setWorkPlans] = useState([]);

  useEffect(() => {
    // Fetch the work plans data from the API or any other source
    // and update the workPlans state with the response
    fetchWorkPlans();
  }, []);

  const fetchWorkPlans = () => {
    // Fetch the work plans data from the API
    fetch("http://localhost:8080/api/workplans", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setWorkPlans(data);
      })
      .catch((error) => {
        console.error("Error fetching work plans:", error);
      });
  };

  return (
    <div className="flex flex-wrap justify-center">
      {workPlans.map((workPlan) => (
        <div className="card w-96 glass m-4" key={workPlan.id}>
          <div className="card-body">
            <h2 className="card-title">{workPlan.title}</h2>
            <p>{workPlan.description}</p>
            <div className="card-actions justify-end">
              <Link to={`/add-tasks/${workPlan.id}`} className="btn btn-primary">
                Add Tasks
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
 

export default Workplans;
