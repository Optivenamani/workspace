import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import Modal from "react-modal";
import { formatDate } from "@fullcalendar/core";

const WorkPlanCalendar = ({ activities, editActivity }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    measurableAchievement: "",
    variance: "",
    comments: "",
  });

  const calendarRef = useRef(null);

  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.setOption("eventDidMount", function (info) {
      if (info.event.extendedProps.id !== null) {
        const dotEl = info.el.getElementsByClassName("fc-list-event-dot")[0];
        if (dotEl) {
          dotEl.style.backgroundColor = "red";
        }
      }
    });
  }, []);

  const handleEventClick = (arg) => {
    const event = arg.event;
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditActivity = async () => {
    const { measurableAchievement, variance, comments } = formData;
    if (!selectedEvent) return;

    const activityId = selectedEvent.extendedProps.id;
    await editActivity(activityId, measurableAchievement, variance, comments);
    setIsModalOpen(false);
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

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin]}
        headerToolbar={{
          left: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        footerToolbar={{
          right: "today prev,next",
        }}
        initialView="listWeek"
        events={activitiesList}
        eventClick={handleEventClick}
        eventClassNames="cursor-pointer"
        height={"85vh"}
        // editable
        // selectable
        // selectMirror
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
          <form onSubmit={handleEditActivity}>
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
                  className="textarea textarea-bordered h-min w-full"
                  name="measurableAchievement"
                  value={formData.measurableAchievement}
                  required
                  onChange={handleFormChange}
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
                  className="textarea textarea-bordered h-min w-full"
                  name="variance"
                  value={formData.variance}
                  required
                  onChange={handleFormChange}
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
                  className="textarea textarea-bordered h-min w-full"
                  name="comments"
                  value={formData.comments}
                  required
                  onChange={handleFormChange}
                  spellCheck
                />
              </div>
            )}
            {(selectedEvent.extendedProps.measurableAchievement === null ||
              selectedEvent.extendedProps.variance === null ||
              selectedEvent.extendedProps.comments === null) && (
              <button className="btn btn-outline w-full mt-4" type="submit">
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
