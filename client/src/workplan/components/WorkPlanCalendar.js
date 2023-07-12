import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";

const WorkPlanCalendar = ({ tasks }) => {
  const navigate = useNavigate();

  const handleDateClick = (arg) => {
    const date = arg.dateStr;
    navigate(`/workplan/${date}`);
    console.log("clicked");
  };

  const handleEventClick = (arg) => {
    const task = arg.event.title;
    navigate(`view-task/task/${task}`);
  };

  const eventSources = [
    {
      events: tasks.map((task) => ({
        title: task.title,
        start: task.time,
      })),
    },
  ];

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        eventSources={eventSources}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventClassNames="cursor-pointer"        
      />
    </div>
  );
};

export default WorkPlanCalendar;
