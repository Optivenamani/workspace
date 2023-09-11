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
                  <td className="flex items-center justify-between py-6">
                    <div className="w-24">
                      <h1 className="stat-title text-xs lausanne">
                        Start Date
                      </h1>
                      <p className="text-md font-bold lausanne">
                        {formatDate(workplan.start_date)}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="w-24">
                      <h1 className="stat-title text-xs lausanne">End Date</h1>
                      <p className="text-md font-bold lausanne">
                        {formatDate(workplan.end_date)}
                      </p>
                    </div>
                  </td>
                  <td>
                    <div className="w-24">
                      <h1 className="stat-title text-xs lausanne">Status</h1>
                      <p className="text-md font-bold lausanne">
                        <span className="countdown lausanne">
                          {workplan.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </td>
                  <td>
                    {/* Action buttons */}
                    <div className="flex">
                      {!(new Date() > new Date(workplan.start_date)) && (
                        <div>
                          <button
                            className="btn btn-sm text-white ml-2"
                            onClick={() =>
                              navigate(`/workplan-details/${workplan.id}`)
                            }
                          >
                            <svg
                              width={18}
                              height={18}
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-1"
                            >
                              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                              <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <g id="SVGRepo_iconCarrier">
                                {" "}
                                <path
                                  d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
                                  stroke="white"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />{" "}
                                <path
                                  d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z"
                                  stroke="white"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />{" "}
                              </g>
                            </svg>
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
