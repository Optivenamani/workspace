import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import Modal from "react-modal";
import { formatDate } from "@fullcalendar/core";
import { formatIsoTimeString } from "@fullcalendar/core/internal";

const WorkPlanCalendar = ({ activities, editactivity }) => {
  const [measurableAchievement, setMeasurableAchievement] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // open model upon clicking on activity (event)
  const handleEventClick = (arg) => {
    const event = arg.event;
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Modify the editactivity function to use the editactivity prop
  const handleEditactivity = async (activityId, measurableAchievement) => {
    await editactivity(activityId, measurableAchievement);
    setIsModalOpen(true);
  };

  const activitiesList = activities.map((activity) => ({
    title: activity.title,
    start: activity.time,
    extendedProps: {
      id: activity.id,
      date: activity.date,
      expectedOutput: activity.expected_output,
      measurableAchievement: activity.measurable_achievement,
      target: activity.target,
      variance: activity.variance,
      comments: activity.comments,
      workplanId: activity.workplan_id,
    },
  }));

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        initialView="listWeek"
        events={activitiesList}
        eventClick={handleEventClick}
        eventClassNames="cursor-pointer"
        height={"85vh"}
        editable
        selectable
        selectMirror
        dayMaxEvents={3}
        ref={calendarRef}
        // eventAdd={function () {}}
        // eventChange={function () {}}
        // eventRemove={function () {}}
        // showNonCurrentDates={false}
      />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-box container mx-auto"
      >
        {selectedEvent && (
          <form
            onSubmit={() =>
              handleEditactivity(
                selectedEvent.extendedProps.id,
                measurableAchievement
              )
            }
          >
            <button
              onClick={closeModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <h2 className="label font-bold uppercase">{selectedEvent.title}</h2>
            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center mt-1">
                <h1 className="ml-1 font-bold">Start Date</h1>
                <p className="text-sm italic ml-2">
                  {formatDate(selectedEvent.extendedProps.date)}
                </p>
              </div>
              <div className="flex items-center mt-1">
                <h1 className="ml-1 font-bold">Start Time</h1>
                <p className="text-sm italic ml-2">
                  {formatIsoTimeString(selectedEvent.start)}
                </p>
              </div>
            </div>
            <div>
              <h1 className="label font-bold">Expectated Output</h1>
              <p className="text-sm italic ml-1">
                {selectedEvent.extendedProps.expectedOutput}
              </p>
            </div>
            {selectedEvent.extendedProps.measurableAchievement !== null ? (
              <div>
                <h1 className="label font-bold">Measurable Achievement</h1>
                <p className="text-sm italic ml-1">
                  {selectedEvent.extendedProps.measurableAchievement}
                </p>
              </div>
            ) : (
              <div>
                <h1 className="label font-bold">Actual Output</h1>
                <textarea
                  className="textarea textarea-bordered h-32 w-full"
                  required
                  onChange={(e) => setMeasurableAchievement(e.target.value)}
                />
              </div>
            )}
            {selectedEvent.extendedProps.measurableAchievement === null && (
              <button className="btn btn-outline w-full mt-1" type="submit">
                Mark as Done
              </button>
            )}
          </form>
        )}
      </Modal>
    </div>
  );
};

export default WorkPlanCalendar;
