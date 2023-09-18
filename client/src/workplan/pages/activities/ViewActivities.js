// ViewActivities component
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import WorkPlanCalendar from "../../components/WorkPlanCalendar";
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
  return date
    .toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");
};

const ViewActivities = () => {
  const [activities, setActivities] = useState([]);
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user.user_id);

  useEffect(() => {
    // Fetch activities data from the server
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          `https://workspace.optiven.co.ke/api/workplan-activities?user_id=${userId}`,
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
          time: `${formatDate(activity.date)}T${activity.time}`,
          date: activity.date,
          expected_output: activity.expected_output,
          measurable_achievement: activity.measurable_achievement,
          variance: activity.variance,
          comments: activity.comments,
        }));
        setActivities(formattedActivities);
        console.log("activities", formattedActivities);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivities();
  }, [token, userId]);

  const date = new Date().getDate();
  console.log(date);

  const handleEditactivity = async (
    activityId,
    measurableAchievement,
    variance,
    comments
  ) => {
    try {
      // Find the activity based on the activityId
      const activityIndex = activities.findIndex(
        (activity) => activity.id === activityId
      );

      if (activityIndex !== -1) {
        // Create a copy of the activities array
        const updatedActivities = [...activities];

        // Update the activity with the new data
        updatedActivities[activityIndex] = {
          ...updatedActivities[activityIndex],
          measurable_achievement: measurableAchievement,
          variance: variance,
          comments: comments,
        };

        // Update the state with the updated activities
        setActivities(updatedActivities);

        // Perform the API update here (assuming it's successful)
        const response = await fetch(
          `https://workspace.optiven.co.ke/api/workplan-activities/${activityId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...updatedActivities[activityIndex], // Send the updated data to the API
              date: formatDate(updatedActivities[activityIndex].date),
              time: formatTime(updatedActivities[activityIndex].time),
            }),
          }
        );

        if (response.ok) {
          // Activity updated successfully, show a success toast
          toast.success("Activity updated successfully!", {
            position: "top-center",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          // Handle error response and show an error toast
          toast.error("Failed to update activity. Please try again.", {
            position: "top-center",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } else {
        // Handle the case where the activity is not found
        console.error("Activity not found");
      }
    } catch (error) {
      console.error(error);
      // Show an error toast for unexpected errors
      toast.error("An error occurred. Please try again.", {
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
      <div className="p-5">
        <WorkPlanCalendar
          activities={activities}
          editactivity={handleEditactivity}
        />
      </div>
    </Sidebar>
  );
};

export default ViewActivities;
