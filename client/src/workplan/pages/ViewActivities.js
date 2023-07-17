// ViewActivities component
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import WorkPlanCalendar from "../components/WorkPlanCalendar";
import { useSelector } from "react-redux";

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes}:00`;
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

  useEffect(() => {
    // Fetch activities data from the server
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/workplan-activities",
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
          target: activity.target,
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
  }, [token]);

  const date = new Date().getDate();
  console.log(date);

  const handleEditactivity = async (
    activityId,
    measurableAchievement,
    variance
  ) => {
    try {
      // Find the activity based on the activityId
      const activity = activities.find(
        (activity) => activity.id === activityId
      );

      // Update the activity with the new measurable achievement
      const response = await fetch(
        `http://localhost:8080/api/workplan-activities/${activityId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...activity,
            measurable_achievement: measurableAchievement,
            variance: variance,
            date: formatDate(activity.date),
            time: formatTime(activity.time),
          }),
        }
      );

      if (response.ok) {
        // Activity updated successfully, update the activities state in the parent component
        const updatedActivities = activities.map((activity) => {
          if (activity.id === activityId) {
            return {
              ...activity,
              measurable_achievement: measurableAchievement,
              variance: variance,
            };
          }
          return activity;
        });
        setActivities(updatedActivities);
      } else {
        // Handle error response
        alert("Failed to update activity");
      }
    } catch (error) {
      alert(error);
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
