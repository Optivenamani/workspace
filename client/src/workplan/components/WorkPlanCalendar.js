import React, { useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
// import { useNavigate } from "react-router-dom";

const WorkPlanCalendar = ({ tasks }) => {
  // const navigate = useNavigate();

  const calendarRef = useRef(null);

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.setOption("eventDidMount", function (info) {
      if (info.event.extendedProps.status === "complete") {
        // Change background color of row
        info.el.style.backgroundColor = "red";

        // Change color of dot marker
        const dotEl = info.el.getElementsByClassName("fc-event-dot")[0];
        if (dotEl) {
          dotEl.style.backgroundColor = "white";
        }
      }
    });
  }, []);

  const handleDateClick = (arg) => {
    const date = arg.dateStr;
    alert(date);
    // todo: go to page showing events for that date
  };

  const handleEventClick = (arg) => {
    const task = arg.event.title;
    alert(task);
  };

  const eventSources = tasks.map((task) => ({
    title: task.title,
    start: task.time,
  }));

  return (
    <div>
      <FullCalendar
        plugins={[
          dayGridPlugin,
          interactionPlugin,
          listPlugin,
          timeGridPlugin,
          // resourceTimelinePlugin,
        ]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        initialView="listWeek"
        events={eventSources}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventClassNames="cursor-pointer"
        height={"85vh"}
        editable
        selectable
        selectMirror
        dayMaxEvents={3} // the number indicates the number of max events displayed before showing "+ y more.."
        ref={calendarRef}
        // eventAdd={function () {}}
        // eventChange={function () {}}
        // eventRemove={function () {}}
        // showNonCurrentDates={false}
        // duration={}
        // schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
      />
    </div>
  );
};

export default WorkPlanCalendar;
