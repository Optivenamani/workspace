import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const ViewScheduledMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    // Function to fetch meetings data from the server
    const fetchMeetings = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/meetings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Fetched meetings data:", data);

        // If there are meetings data in localStorage, use it to update state
        const storedMeetings =
          JSON.parse(localStorage.getItem("meetings")) || [];
        const updatedMeetings = data.map((meeting) => {
          const storedMeeting = storedMeetings.find(
            (storedMeeting) => storedMeeting.id === meeting.id
          );
          return storedMeeting ? storedMeeting : meeting;
        });

        setMeetings(updatedMeetings);
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      }
    };

    fetchMeetings();
  }, [token]); // Make sure to include token as a dependency

  // Define a function to get the current time in the format "HH:mm AM/PM"
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleCheckIn = async (meetingId) => {
    try {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const formattedreport_time = `${hours}:${minutes}:${seconds}`;

      const response = await fetch(
        `http://localhost:8080/api/meetings/${meetingId}/report`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            report_time: formattedreport_time,
          }),
        }
      );

      if (response.ok) {
        const updatedMeetings = meetings.map((meeting) => {
          if (meeting.id === meetingId) {
            return {
              ...meeting,
              report_time: formattedreport_time,
              hasReportTime: true,
            };
          }
          return meeting;
        });

        setMeetings(updatedMeetings);
        localStorage.setItem("meetings", JSON.stringify(updatedMeetings));
      } else {
        console.error("Failed to update report time for the meeting.");
      }
    } catch (error) {
      console.error("Error updating report time:", error);
    }
  };

  const handleCheckout = async (meetingId) => {
    try {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const formattedExitTime = `${hours}:${minutes}:${seconds}`;

      const response = await fetch(
        `http://localhost:8080/api/meetings/${meetingId}/exit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            exit_time: formattedExitTime,
          }),
        }
      );

      if (response.ok) {
        const updatedMeetings = meetings.map((meeting) => {
          if (meeting.id === meetingId) {
            return {
              ...meeting,
              exit_time: formattedExitTime,
              hasExitTime: true,
            };
          }
          return meeting;
        });

        setMeetings(updatedMeetings);
        localStorage.setItem("meetings", JSON.stringify(updatedMeetings));
      } else {
        console.error("Failed to update exit time for the meeting.");
      }
    } catch (error) {
      console.error("Error updating exit time:", error);
    }
  };

  const handleDelete = async (meetingId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/meetings/${meetingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedMeetings = meetings.filter(
          (meeting) => meeting.id !== meetingId
        );
        setMeetings(updatedMeetings);
        localStorage.setItem("meetings", JSON.stringify(updatedMeetings));
      } else {
        console.error("Failed to delete the meeting.");
      }
    } catch (error) {
      console.error("Error deleting the meeting:", error);
    }
  };

  // const handleEdit = (meetingId) => {
  //   // Navigate to the edit page with the meetingId as a parameter
  //   navigate(`/edit-meeting/${meetingId}`);
  // };

  if (!dataFetched) {
    const spinnerStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh", // Adjust as needed
    };

    const spinnerElementStyle = {
      border: "4px solid rgba(0, 0, 0, 0.1)",
      borderLeftColor: "#333", // Color of the spinner
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      animation: "spin 1s linear infinite",
    };

    return (
      <div style={spinnerStyle}>
        <div style={spinnerElementStyle}></div>
      </div>
    );
  }

  return (
    <Sidebar>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Arrival Time</th>
              <th className="px-6 py-4">Meeting Date</th>
              <th className="px-6 py-4">Purpose</th>
             
              <th className="px-6 py-4">Report Time</th>
              <th className="px-6 py-4">Exit Time</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting) => (
              <tr key={meeting.id} className="border-b dark:border-neutral-500">
                <td className="whitespace-nowrap px-6 py-4 font-medium">
                  {meeting.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {meeting.client_name}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {meeting.arrival_time}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                {format(new Date(meeting.meeting_date), "yyyy-MM-dd")}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {meeting.purpose}
                </td>
                
                <td className="whitespace-nowrap px-6 py-4">
                  {meeting.report_time ? meeting.report_time : "Not Checked In"}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {meeting.exit_time || "N/A"}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <button
                    onClick={() => handleCheckIn(meeting.id)}
                    className="btn btn-outline btn-success"
                    disabled={meeting.report_time !== null}
                  >
                    {meeting.report_time ? "Checked In" : "Check In"}
                  </button>
                  <button
                    onClick={() => handleCheckout(meeting.id)}
                    className="btn btn-outline btn-info"
                    disabled={meeting.exit_time !== null}
                  >
                    {meeting.exit_time ? "Checked Out" : "Check Out"}
                  </button>
                  <button
                    onClick={() => handleDelete(meeting.id)}
                    className="btn btn-outline btn-error"
                  >
                    Delete
                  </button>
                  {meeting.report_time === null && (
                    <Link
                      to={`/edit-meeting/${meeting.id}`} // Update the route path and parameter accordingly
                      className="btn btn-outline btn-warning"
                    >
                      Edit
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Sidebar>
  );
};

export default ViewScheduledMeetings;
