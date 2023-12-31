import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import formatDate from "../../../utils/formatDate";
import huh from "../../../assets/app-illustrations/Shrug-bro.png";

const ViewWorkPlans = () => {
  const [workplans, setWorkplans] = useState([]);
  const token = useSelector((state) => state.user.token);
  const accessRole = useSelector((state) => state.user.user.Accessrole);
  const [selectedWorkplan, setSelectedWorkplan] = useState(null);
  const userId = useSelector((state) => state.user.user.user_id);
  const [countdownTimers, setCountdownTimers] = useState({});

  const navigate = useNavigate();

  console.log("Access role", accessRole.split("#").includes("workplanAdmin"));

  useEffect(() => {
    // Fetch visitor data from the server
    const fetchWorkPlans = async () => {
      try {
        const response = await fetch(
          `https://workspace.optiven.co.ke/api/workplans?user_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        // Update visitors state only if the response data is an array
        if (Array.isArray(data)) {
          // Calculate the target date and time for the countdown timer
          const updatedWorkplans = data.map((workplan) => {
            const startDate = new Date(workplan.start_date);

            // Calculate the target date (Saturday preceding the workplan)
            const targetDate = new Date(startDate);
            targetDate.setDate(
              startDate.getDate() - ((startDate.getDay() + 1) % 7)
            ); // Set to previous Saturday
            targetDate.setHours(24, 0o0, 0, 0); // Set to 12:00 PM

            // Calculate time left based on the target date
            const timeLeft = targetDate - new Date();

            // Update the workplan with the target date
            return {
              ...workplan,
              targetDate, // Add this to the workplan object
              timeLeft, // You can keep this for displaying the countdown
            };
          });

          setWorkplans(updatedWorkplans);
        } else {
          console.error("Invalid response format. Expected an array.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWorkPlans();
  }, [token, userId]);

  const handleClick = (workplanId) => {
    navigate(`/view-workplans/${workplanId}`);
  };

  const updateCountdownTimers = () => {
    const updatedTimers = {};

    workplans.forEach((workplan) => {
      const timeLeft = workplan.targetDate - new Date();

      if (timeLeft <= 0) {
        updatedTimers[workplan.id] = "Expired";
      } else {
        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor(
          (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutesLeft = Math.floor(
          (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
        );
        const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
        updatedTimers[
          workplan.id
        ] = `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;
      }
    });

    setCountdownTimers(updatedTimers);
  };

  useEffect(() => {
    const countdownInterval = setInterval(updateCountdownTimers, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workplans]);

  const handleView = (workplan) => {
    console.log("view workplan:", workplan);
    setSelectedWorkplan(workplan);
  };

  const handleCloseModal = () => {
    setSelectedWorkplan(null);
  };

  const deleteWorkplan = async () => {
    try {
      if (!selectedWorkplan) {
        throw new Error("No workplan selected for deletion.");
      }

      const response = await fetch(
        `https://workspace.optiven.co.ke/api/workplans/${selectedWorkplan.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to delete workplan. Server responded with status ${response.status}. Error message: ${errorData.message}`
        );
      }

      // Workplan successfully deleted, update the state
      setWorkplans((prevWorkplans) =>
        prevWorkplans.filter((workplan) => workplan.id !== selectedWorkplan.id)
      );

      handleCloseModal();
      toast.success("Workplan deleted successfully", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "Failed to delete workplan. Please try again.",
        {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  return (
    <Sidebar>
      <div className="container mx-auto py-6">
        <div className="block mx-10">
          <div className="text-sm breadcrumbs">
            <ul>
              <li>
                <Link to="/workplan-home">Home</Link>
              </li>
              <li>View Workplans</li>
            </ul>
          </div>
        </div>
        <div className="block">
          {Array.isArray(workplans) && workplans.length > 0 ? (
            <table className="table table-zebra w-full bg-base-100 shadow-xl mx-10">
              <tbody>
                {workplans.map((workplan) => (
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
                        <h1 className="stat-title text-xs lausanne">
                          End Date
                        </h1>
                        <p className="text-md font-bold lausanne">
                          {formatDate(workplan.end_date)}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className="w-24">
                        <h1 className="stat-title text-xs lausanne">
                          Editing Time Left
                        </h1>
                        <p className="text-md font-bold lausanne">
                          <span className="countdown lausanne">
                            {countdownTimers[workplan.id]}
                          </span>
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
                    <td className="w-8">
                      {workplan.status === "pending" && (
                        <button
                          onClick={() => handleClick(workplan.id)}
                          className="btn btn-primary btn-sm text-white"
                          disabled={new Date() > new Date(workplan.start_date)}
                        >
                          Add Activities
                        </button>
                      )}
                    </td>
                    <td className="w-4">
                      {(accessRole.split("#").includes("workplanAdmin") ||
                        !(new Date() > new Date(workplan.start_date))) && (
                        <div>
                          {(accessRole.split("#").includes("workplanAdmin") ||
                            workplan.status === "pending") && (
                            <button
                              className="btn btn-square btn-error btn-sm text-white ml-2"
                              onClick={() => handleView(workplan)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={18}
                                height={18}
                                fill="currentColor"
                                className="bi bi-trash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path
                                  fill-rule="evenodd"
                                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm text-white ml-2"
                        onClick={() =>
                          navigate("/workplan-details/" + workplan.id)
                        }
                        disabled={new Date() > new Date(workplan.start_date)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center">
              <div className="flex flex-col items-center mt-20">
                <img src={huh} alt="huh" className="lg:w-96" />
                <h1 className="font-bold text-center">
                  Nothing to see here. Add a workplan to get started.
                </h1>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal for displaying deletion warning */}
      {selectedWorkplan && (
        <div className="fixed inset-0 flex justify-center items-center z-10 bg-black bg-opacity-50">
          <div className="modal-box container mx-auto">
            <button
              onClick={handleCloseModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">WARNING</h2>
            <label className="label">
              Are you sure you want to delete this workplan? All the activities
              under this workplan will also be deleted.
            </label>

            <div className="flex flex-col">
              <button
                onClick={deleteWorkplan}
                className="btn btn-error text-white mt-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
};

export default ViewWorkPlans;
