import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import { useParams, useNavigate, Link } from "react-router-dom";
import huh from "../../../assets/app-illustrations/Shrug-bro.png";

function formatDate(inputDate) {
  // Create a new Date object from the input string
  const date = new Date(inputDate);

  // Extract year, month, and day components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  // Construct the formatted date string
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

const WorkplanDetails = () => {
  const [workplan, setWorkplan] = useState({});
  const accessRole = useSelector((state) => state.user.user.Accessrole);
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
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

  // Sort activities by date in ascending order
  activities.sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleView = (workplan) => {
    console.log("view workplan:", workplan);
    setSelectedActivity(workplan);
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
  };

  const deleteActivity = async () => {
    try {
      if (!selectedActivity) {
        throw new Error("No activity selected for deletion.");
      }

      console.log(selectedActivity);

      const response = await fetch(
        `https://workspace.optiven.co.ke/api/workplan-activities/${selectedActivity.id}`,
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
          `Failed to delete activity. Server responded with status ${response.status}. Error message: ${errorData.message}`
        );
      }

      // Workplan successfully deleted, update the state
      setActivities((prevActivities) =>
        prevActivities.filter((workplan) => workplan.id !== selectedActivity.id)
      );

      handleCloseModal();
      toast.success("Activity deleted successfully", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "Failed to delete activity. Please try again.",
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
      <div className="container px-4 py-6 mx-auto">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link to="/workplan-home">Home</Link>
            </li>
            <li>Work Plan Details</li>
          </ul>
        </div>
        <div>
          <div className="flex flex-col md:flex-row md:justify-between lg:flex-row lg:justify-between">
            <div className="flex items-center">
              <label className="label font-bold text-sm">Start Date: </label>
              <p className="italic text-sm">
                {formatDate(workplan.start_date)}
              </p>
              <label className="label font-bold text-sm">End Date: </label>
              <p className="italic text-sm">{formatDate(workplan.end_date)}</p>
            </div>
            <div className="flex flex-col md:flex md:flex-row lg:flex lg:flex-row">
              {workplan.status === "pending" && (
                <>
                  <button
                    onClick={() => navigate("/view-workplans/" + workplan.id)}
                    className="btn text-white md:btn-md md:mr-1 lg:btn-md lg:mt-0 lg:mr-1"
                  >
                    Add Activity
                  </button>
                  {accessRole.split("#").includes("workplanAdmin") && (
                    <>
                      <button
                        onClick={handleReject}
                        className="btn btn-error mt-1 text-white md:btn-md md:mr-1 md:mt-0 lg:btn-md lg:mt-0 lg:mr-1"
                      >
                        Reject
                      </button>
                      <button
                        onClick={handleApprove}
                        className="btn mt-1 btn-primary text-white md:btn-md md:mt-0 lg:btn-md lg:mt-0"
                      >
                        Approve
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <h3 className="label font-bold text-xl">Activities</h3>
          <div>
            {Array.isArray(activities) &&
            activities.length > 0 &&
            activities[0].id !== null ? (
              <table className="table table-zebra w-full bg-base-100 shadow-xl">
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td>
                        <div>
                          <h1 className="stat-title text-xs lausanne italic">
                            Activity
                          </h1>
                          <p className="text-sm font-bold lausanne">
                            {activity.title}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div>
                          <h1 className="stat-title text-xs lausanne italic">
                            Date
                          </h1>
                          <p className="text-sm font-bold lausanne">
                            {formatDate(activity.date)}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div>
                          <h1 className="stat-title text-xs lausanne italic">
                            Time
                          </h1>
                          <p className="text-sm font-bold lausanne">
                            {activity.time}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div>
                          <h1 className="text-gray-400 text-xs lausanne italic">
                            Expected Output
                          </h1>
                          <div
                            className="tooltip"
                            data-tip={activity.expected_output}
                          >
                            <p className="text-sm font-bold lausanne w-3/4">
                              {activity.expected_output}
                            </p>
                          </div>
                        </div>
                      </td>
                      {workplan.status === "pending" && (
                        <td>
                          <button
                            onClick={() => handleView(activity)}
                            className="btn btn-sm mt-1 btn-error text-white md:mt-0 lg:mt-0"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex justify-center">
                <div className="flex flex-col items-center mt-20">
                  <img src={huh} alt="huh" className="lg:w-96" />
                  <h1 className="font-bold text-center">
                    No activities in this workplan.
                  </h1>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal for displaying deletion warning */}
      {selectedActivity && (
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
              Are you sure you want to delete this activity?
            </label>

            <div className="flex flex-col">
              <button
                onClick={deleteActivity}
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

export default WorkplanDetails;
