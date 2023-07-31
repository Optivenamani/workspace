import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import formatDate from "../../utils/formatDate";
import huh from "../../assets/app-illustrations/Shrug-bro.png";

const FillRemarks = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [remarks, setRemarks] = useState("");
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user.user_id);

  useEffect(() => {
    // Fetch activities data from the server
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/workplan-activities/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        const filteredData = data.filter(
          (item) =>
            item.measurable_achievement !== null && item.remarks === null
        );

        setActivities(filteredData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivities();
  }, [token, userId]);

  const handleView = (activity) => {
    console.log("view activity:", activity);
    setSelectedActivity(activity);
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
    setRemarks("");
  };

  const handleFillRemarks = async () => {
    try {
      // Check if remarks are empty
      if (remarks === "") {
        toast.error("Remarks cannot be empty!", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      // Update the activity with the new remarks
      const activityId = selectedActivity.id;
      const response = await fetch(
        `http://localhost:8080/api/workplan-activities/${activityId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...selectedActivity,
            remarks: remarks,
            time: selectedActivity.time,
            date: formatDate(selectedActivity.date),
          }),
        }
      );

      if (response.ok) {
        // Activity updated successfully, update the activities state in the parent component
        const updatedActivities = activities.map((activity) => {
          if (activity.id === activityId) {
            return {
              ...activity,
              remarks: remarks,
            };
          }
          return activity;
        });

        setActivities(updatedActivities);
        setSelectedActivity((prev) => ({
          ...prev,
          remarks: remarks,
        }));

        handleCloseModal();

        toast.success("Remarks added successfully!", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Failed to update remarks. Please try again.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to add remarks. Please try again.", {
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

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = formatDate(activity.date);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {});

  function truncateText(text, maxLength = 20) {
    if (!text) {
      return "";
    }

    if (text.length <= maxLength) {
      return text;
    } else {
      return text.slice(0, maxLength - 3) + "...";
    }
  }

  return (
    <Sidebar>
      <div className="bg-base-200 pt-5 pb-10 min-h-full min-w-full">
        <div>
          {/* Loop through the grouped activities and render them */}
          {Array.isArray(groupedActivities) ? (
            Object.entries(groupedActivities).map(
              ([date, activitiesForDate]) => (
                <div key={date} className="block mx-10 md:mx-20 lg:mx-24">
                  <label className="label font-bold lausanne mt-5">
                    {date}
                  </label>
                  <table className="table w-full bg-base-100 shadow-xl">
                    <tbody>
                      {activitiesForDate.map((activity) => (
                        <tr key={activity.id}>
                          <td className="flex items-center justify-between py-6">
                            <div className="w-24">
                              <h1 className="stat-title text-xs lausanne">
                                Marketer
                              </h1>
                              <p className="text-xs font-bold lausanne">
                                {activity.name}
                              </p>
                            </div>
                            <div className="w-24">
                              <h1 className="stat-title text-xs lausanne">
                                Activity
                              </h1>
                              <p className="text-xs font-bold lausanne">
                                {activity.title}
                              </p>
                            </div>
                            <div className="w-24">
                              <h1 className="stat-title text-xs lausanne">
                                Day
                              </h1>
                              <p className="text-xs font-bold lausanne">
                                {formatDate(activity.date)}
                              </p>
                            </div>
                            <div className="w-24">
                              <h1 className="text-gray-400 text-xs lausanne">
                                Expected Output
                              </h1>
                              <div
                                className="tooltip"
                                data-tip={activity.expected_output}
                              >
                                <p className="text-xs font-bold lausanne w-3/4">
                                  {truncateText(activity.expected_output, 20)}
                                </p>
                              </div>
                            </div>
                            <div className="w-24">
                              <h1 className="text-gray-400 text-xs lausanne w-1/2">
                                Measurable Achievement
                              </h1>
                              <div
                                className="tooltip"
                                data-tip={activity.measurable_achievement}
                              >
                                <p className="text-xs font-bold lausanne w-3/4">
                                  {truncateText(
                                    activity.measurable_achievement,
                                    20
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="w-24">
                              <h1 className="stat-title text-xs lausanne">
                                Variance
                              </h1>
                              <div
                                className="tooltip"
                                data-tip={activity.variance}
                              >
                                <p className="text-xs font-bold lausanne">
                                  {truncateText(activity.variance, 20)}
                                </p>
                              </div>
                            </div>
                            <div className="w-24">
                              <h1 className="stat-title text-xs lausanne">
                                Remarks
                              </h1>
                              <div
                                className="tooltip"
                                data-tip={activity.remarks}
                              >
                                <p className="text-xs font-bold lausanne">
                                  {truncateText(activity.remarks, 20)}
                                </p>
                              </div>
                            </div>
                            {/* Action buttons */}
                            <div>
                              <button
                                onClick={() => handleView(activity)}
                                className="btn btn-primary btn-sm text-white"
                                disabled={activity.remarks !== null}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  class="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                Comment
                              </button>
                              {/* <button className="btn btn-square btn-outline btn-sm ml-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="feather feather-edit-3"
                              >
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                              </svg>
                            </button>
                            <button className="btn btn-square btn-error text-white btn-sm ml-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                class="bi bi-trash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                <path
                                  fill-rule="evenodd"
                                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                />
                              </svg>
                            </button> */}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )
          ) : (
            <div className="flex justify-center">
              <div className="flex flex-col items-center mt-20">
                <img src={huh} alt="huh" className="lg:w-96" />
                <h1 className="font-bold text-center">Nothing to see here.</h1>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal for displaying activity details */}
      {selectedActivity && (
        <div className="fixed inset-0 flex justify-center items-center z-10 bg-black bg-opacity-50">
          <div className="modal-box container mx-auto">
            <button
              onClick={handleCloseModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">
              {selectedActivity.name.toUpperCase()}
            </h2>
            <label className="label font-bold">Activity</label>
            <p className="ml-1 italic">{selectedActivity.title}</p>
            <label className="label font-bold">Expected Output</label>
            <p className="ml-1 italic">{selectedActivity.expected_output}</p>
            <label className="label font-bold">Measurable Achievement</label>
            <p className="ml-1 italic">
              {selectedActivity.measurable_achievement}
            </p>
            <div className="flex flex-col">
              <label className="label font-bold">Remarks</label>
              {selectedActivity.remarks !== null ? (
                selectedActivity.remarks
              ) : (
                <>
                  <textarea
                    type="text"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="textarea textarea-bordered h-24"
                    placeholder="Place your remarks here..."
                  />
                  <button
                    onClick={handleFillRemarks}
                    className="btn btn-outline mt-2"
                  >
                    Submit Remarks
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
};

export default FillRemarks;
