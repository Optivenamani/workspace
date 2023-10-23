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
          `https://workspace.optiven.co.ke/api/workplan-activities/all`,
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
        `https://workspace.optiven.co.ke/api/workplan-activities/${activityId}`,
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
      <div className="container py-6 mx-10">
        <div>
          {/* Loop through the grouped activities and render them */}
          {Object.keys(groupedActivities).length > 0 ? (
            Object.entries(groupedActivities).map(
              ([date, activitiesForDate]) => (
                <div key={date} className="block">
                  <label className="label font-extrabold lausanne mt-5 italic underline">
                    {date}
                  </label>
                  <table className="table min-w-full bg-base-100 shadow-xl">
                    <tbody>
                      {activitiesForDate.map((activity) => (
                        <tr key={activity.id}>
                          <td className="flex items-center justify-between py-6">
                            <div className="min-w-fit">
                              <h1 className="stat-title text-xs lausanne italic">
                                Marketer
                              </h1>
                              <p className="text-sm font-bold lausanne">
                                {truncateText(activity.name, 20)}
                              </p>
                            </div>
                          </td>
                          <td>
                            <div className="min-w-fit">
                              <h1 className="stat-title text-xs lausanne italic">
                                Activity
                              </h1>
                              <p className="text-sm font-bold lausanne">
                                {truncateText(activity.title, 20)}
                              </p>
                            </div>
                          </td>
                          <td>
                            <div className="min-w-fit">
                              <h1 className="stat-title text-xs lausanne italic">
                                Day
                              </h1>
                              <p className="text-sm font-bold lausanne">
                                {formatDate(activity.date)}
                              </p>
                            </div>
                          </td>
                          <td>
                            <div className="min-w-fit">
                              <h1 className="text-gray-400 text-xs lausanne italic">
                                Expected Output
                              </h1>
                              <p className="text-sm font-bold lausanne w-3/4">
                                {truncateText(activity.expected_output, 20)}
                              </p>
                            </div>
                          </td>
                          <td>
                            <div className="min-w-fit">
                              <h1 className="text-gray-400 text-xs lausanne italic w-1/2">
                                Measurable Achievement
                              </h1>
                              <p className="text-sm font-bold lausanne w-3/4">
                                {truncateText(
                                  activity.measurable_achievement,
                                  25
                                )}
                              </p>
                            </div>
                          </td>
                          <td>
                            <div className="min-w-fit">
                              <h1 className="stat-title text-xs lausanne italic">
                                Variance
                              </h1>
                              <p className="text-sm font-bold lausanne">
                                {truncateText(activity.variance, 20)}
                              </p>
                            </div>
                          </td>
                          <td>
                            <div className="min-w-fit">
                              <h1 className="stat-title text-xs lausanne italic">
                                Marketer Comments
                              </h1>
                              <p className="text-sm font-bold lausanne">
                                {truncateText(activity.comments, 20)}
                              </p>
                            </div>
                          </td>
                          <td>
                            <div className="min-w-fit">
                              <h1 className="stat-title text-xs lausanne italic">
                                RM Remarks
                              </h1>
                              <p className="text-sm font-bold lausanne">
                                {truncateText(activity.remarks, 20)}
                              </p>
                            </div>
                          </td>
                          <td>
                            {/* Action buttons */}
                            <div>
                              <button
                                onClick={() => handleView(activity)}
                                className="btn btn-primary btn-sm text-white"
                                disabled={
                                  activity.remarks !== null ||
                                  activity.remarks === ""
                                }
                              >
                                Comment
                              </button>
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
                <h1 className="font-bold text-center">
                  Nothing to see here. Check back later
                </h1>
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
            <label className="label font-bold">Comments</label>
            <p className="ml-1 italic">{selectedActivity.comments}</p>
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
