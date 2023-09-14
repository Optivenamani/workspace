import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import formatDate from "../../../utils/formatDate";
import huh from "../../../assets/app-illustrations/Shrug-bro.png";

const ApproveWorkplans = () => {
  const [workplans, setWorkplans] = useState([]);
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user.user_id);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch workplans data from the server
    const fetchPendingWorkplans = async () => {
      try {
        const response = await fetch(
          `https://workspace.optiven.co.ke/api/workplans/pending`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("workplans:", data);
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
      <div className="container px-4 py-6 mx-auto">
        <div className="block mx-20">
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link to="/workplan-home">Home</Link>
              </li>
              <li>Approve Work Plans</li>
            </ul>
          </div>
        </div>
        <div className="block mx-20">
          {Array.isArray(workplans) && workplans.length > 0 ? (
            workplans.map((workplan) => (
              <table className="table table-zebra w-full bg-base-100 shadow-xl">
                <tr key={workplan.id}>
                  <td className="w-64">
                    <div>
                      <h1 className="stat-title text-xs lausanne">Marketer</h1>
                      <p className="text-md font-bold lausanne">
                        {workplan.marketer_name}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <h1 className="stat-title text-xs lausanne">
                        Start Date
                      </h1>
                      <p className="text-md font-bold lausanne">
                        {formatDate(workplan.start_date)}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <h1 className="stat-title text-xs lausanne">End Date</h1>
                      <p className="text-md font-bold lausanne">
                        {formatDate(workplan.end_date)}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <h1 className="stat-title text-xs lausanne">Status</h1>
                      <p className="text-md font-bold lausanne">
                        <span className="countdown lausanne">
                          {workplan.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="flex">
                      {!(new Date() > new Date(workplan.start_date)) && (
                        <div>
                          <button
                            className="btn btn-sm text-white ml-2"
                            onClick={() =>
                              navigate(`/workplan-details/${workplan.id}`)
                            }
                          >
                            View
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              </table>
            ))
          ) : (
            <div className="flex justify-center">
              <div className="flex flex-col items-center mt-20">
                <img src={huh} alt="huh" className="lg:w-96" />
                <h1 className="font-bold text-center">
                  No work plans left to approve. Check back later.
                </h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default ApproveWorkplans;
