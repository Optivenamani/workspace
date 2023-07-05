import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import WorkPlanCalendar from "../components/WorkPlanCalendar";
import { useSelector } from "react-redux";

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

const ViewWorkPlans = () => {
  const [tasks, setTasks] = useState([]);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    // Fetch tasks data from the server
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("tasks:", data); // Debugging statement

        // Format tasks and update state
        const formattedTasks = data.map((task) => ({
          title: task.title,
          time: `${formatDate(task.date)}T${task.time}`,
        }));
        setTasks(formattedTasks);
        console.log("tasks", formattedTasks);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, [token]);

  return (
    <Sidebar>
      <div className="p-5">
        <WorkPlanCalendar tasks={tasks} />
      </div>
    </Sidebar>
  );
};

export default ViewWorkPlans;
