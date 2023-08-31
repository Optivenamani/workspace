import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import Modal from "react-modal";
import { formatDate } from "@fullcalendar/core";

const WorkPlanCalendar = ({ activities, editactivity }) => {
  const [measurableAchievement, setMeasurableAchievement] = useState("");
  const [variance, setVariance] = useState("");
  const [comments, setComments] = useState("");

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calendarRef = useRef(null);

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.setOption("eventDidMount", function (info) {
      if (info.event.extendedProps.id !== null) {
        // Change background color of row
        // info.el.style.backgroundColor = "red";
        // Change color of dot marker
        const dotEl = info.el.getElementsByClassName("fc-list-event-dot")[0];
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

  // Modify the editActivity function to use the editActivity prop
  const handleEditactivity = async (
    activityId,
    measurableAchievement,
    variance,
    comments
  ) => {
    await editactivity(activityId, measurableAchievement, variance, comments);
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
      variance: activity.variance,
      comments: activity.comments,
      workplanId: activity.workplan_id,
    },
  }));

  console.log(activitiesList);

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
        // editable
        // selectable
        selectMirror
        dayMaxEvents={3}
        ref={calendarRef}
        // updateSize
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
                measurableAchievement,
                variance,
                comments
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
                  {selectedEvent.start.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    // timeZone: "EAT",
                  })}
                </p>
              </div>
            </div>
            <div>
              <h1 className="label font-bold">Expectated Output</h1>
              <p className="text-sm italic ml-1">
                {selectedEvent.extendedProps.expectedOutput}
              </p>
            </div>
            {/* render textarea if there's no measureable achievement */}
            {selectedEvent.extendedProps.measurableAchievement !== null ? (
              <div>
                <h1 className="label font-bold">Measurable Achievement</h1>
                <p className="text-sm italic ml-1">
                  {selectedEvent.extendedProps.measurableAchievement}
                </p>
              </div>
            ) : (
              <div>
                <h1 className="label font-bold">Measurable Achievement</h1>
                <textarea
                  className="textarea textarea-bordered h-32 w-full"
                  required
                  onChange={(e) => setMeasurableAchievement(e.target.value)}
                  spellCheck
                />
              </div>
            )}
            {selectedEvent.extendedProps.variance !== null ? (
              <div>
                <h1 className="label font-bold">Variance</h1>
                <p className="text-sm italic ml-1">
                  {selectedEvent.extendedProps.variance}
                </p>
              </div>
            ) : (
              <div>
                <h1 className="label font-bold">Variance</h1>
                <textarea
                  className="textarea textarea-bordered h-32 w-full"
                  required
                  onChange={(e) => setVariance(e.target.value)}
                  spellCheck
                />
              </div>
            )}
            {selectedEvent.extendedProps.comments !== null ? (
              <div>
                <h1 className="label font-bold">Comments</h1>
                <p className="text-sm italic ml-1">
                  {selectedEvent.extendedProps.comments}
                </p>
              </div>
            ) : (
              <div>
                <h1 className="label font-bold">Comments</h1>
                <textarea
                  className="textarea textarea-bordered h-32 w-full"
                  required
                  onChange={(e) => setComments(e.target.value)}
                  spellCheck
                />
              </div>
            )}
            {(selectedEvent.extendedProps.measurableAchievement === null ||
              selectedEvent.extendedProps.variance === null ||
              selectedEvent.extendedProps.comments === null) && (
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
