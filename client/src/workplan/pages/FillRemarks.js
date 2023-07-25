import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  return timeStr.slice(11, 19);
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

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
        console.log("activities:", data); // Debugging statement

        // Format activities and update state
        const formattedActivities = data.map((activity) => ({
          id: activity.id,
          workplan_id: activity.workplan_id,
          title: activity.title,
          date: activity.date,
        }));
        setActivities(formattedActivities);
        console.log("activities", formattedActivities);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivities();
  }, [token, userId]);

  // useEffect(() => {
  //   // Sample activities data (replace this with your actual data)
  //   const sampleActivities = [
  //     {
  //       id: 1,
  //       workplan_id: "WP-001",
  //       title: "Activity 1",
  //       date: "2023-07-26T08:00:00",
  //     },
  //     {
  //       id: 2,
  //       workplan_id: "WP-002",
  //       title: "Activity 2",
  //       date: "2023-07-27T09:30:00",
  //     },
  //     {
  //       id: 3,
  //       workplan_id: "WP-003",
  //       title: "Activity 3",
  //       date: "2023-07-28T10:45:00",
  //     },
  //   ];

  //   // Format activities and update state
  //   const formattedActivities = sampleActivities.map((activity) => ({
  //     id: activity.id,
  //     workplan_id: activity.workplan_id,
  //     title: activity.title,
  //     date: activity.date,
  //   }));
  //   setActivities(formattedActivities);
  // }, []);

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
      if (!remarks.trim() === "") {
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
      const updatedActivity = {
        ...selectedActivity,
        remarks: remarks.trim(),
      };

      // You can send the updatedActivity to the backend here if needed
      // For demonstration purposes, we are just updating the local state.

      setSelectedActivity(updatedActivity);
      setRemarks("");

      toast.success("Remarks added successfully!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error(error.message || "Failed to add remarks. Please try again.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <Sidebar>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Workplan ID
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                ID
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Title
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Date (sorted)
              </th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <tr className="odd:bg-gray-50" key={activity.id}>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {activity.workplan_id}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {activity.id}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {activity.title}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  {formatDate(activity.date)}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                  <button
                    onClick={() => handleView(activity)}
                    className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for displaying activity details */}
      {selectedActivity && (
        <div className="fixed inset-0 flex justify-center items-center z-10 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
              Activity Details (ID: {selectedActivity.id})
            </h2>
            <p>
              <strong>Workplan ID:</strong> {selectedActivity.workplan_id}
            </p>
            <p>
              <strong>Title:</strong> {selectedActivity.title}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(selectedActivity.date)}
            </p>
            {/* Add other fields here */}
            <div className="mt-4">
              <strong>Remarks:</strong>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="border border-gray-300 px-2 py-1 rounded"
              />
              <button
                onClick={handleFillRemarks}
                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit Remarks
              </button>
            </div>
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Sidebar>
  );
};

export default FillRemarks;
