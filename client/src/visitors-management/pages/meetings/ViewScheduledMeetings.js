import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewScheduledMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch meetings data from the server
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/meetings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Fetched meetings data:", data);
        setMeetings(data);
        setDataFetched(true); // Set dataFetched to true after setting meetings
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
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleCheckIn = (meetingId) => {
    const updatedMeetings = meetings.map((meeting) => {
      if (meeting.id === meetingId) {
        return {
          ...meeting,
          reportTime: getCurrentTime(), // Implement getCurrentTime() to get the current time
        };
      }
      return meeting;
    });

    setMeetings(updatedMeetings);
  };

  const handleCheckOut = (meetingId) => {
    const updatedMeetings = meetings.map((meeting) => {
      if (meeting.id === meetingId) {
        return {
          ...meeting,
          exitTime: getCurrentTime(), // Implement getCurrentTime() to get the current time
        };
      }
      return meeting;
    });

    setMeetings(updatedMeetings);
  };

  const handleDelete = (meetingId) => {
    const updatedMeetings = meetings.filter((meeting) => meeting.id !== meetingId);
    setMeetings(updatedMeetings);
  };

  const handleEdit = (meetingId) => {
    // Navigate to the edit page with the meetingId as a parameter
    navigate(`/edit-meeting/${meetingId}`);
  };

  
if (!dataFetched) {
    return <div>Loading...</div>; // Show a loading message until data is fetched
  };

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
            <th className="px-6 py-4">Room</th>
            <th className="px-6 py-4">Report Time</th>
            <th className="px-6 py-4">Exit Time</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          
            {meetings.map((meeting) => (
                <tr key={meeting.id} className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap px-6 py-4 font-medium">{meeting.id}</td>
                  <td className="whitespace-nowrap px-6 py-4">{meeting.clientName}</td> {/* Verify the field name */}
                  <td className="whitespace-nowrap px-6 py-4">{meeting.arrivalTime}</td> {/* Verify the field name */}
                  <td className="whitespace-nowrap px-6 py-4">{meeting.meetingDate}</td> {/* Verify the field name */}
                  <td className="whitespace-nowrap px-6 py-4">{meeting.purpose}</td>
                  <td className="whitespace-nowrap px-6 py-4">{meeting.room}</td>
                  <td className="whitespace-nowrap px-6 py-4">{meeting.reportTime || "N/A"}</td>
                  <td className="whitespace-nowrap px-6 py-4">{meeting.exitTime || "N/A"}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                <button
                onClick={() => handleCheckIn(meeting.id)}
                className="inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1 hover:text-white focus:outline-none focus:ring active:text-opacity-75 btn btn-warning"
              >
                <span className="block rounded-full bg-white px-4 py-2 text-xs font-medium hover:bg-transparent">
                  Check In
                </span>
              </button>
                  <button
                  onClick={() => handleCheckOut(meeting.id)}
                  className="inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1 hover:text-white focus:outline-none focus:ring active:text-opacity-75 btn btn-warning"
                >
                  <span className="block rounded-full bg-white px-4 py-2 text-xs font-medium hover:bg-transparent">
                    Check Out
                  </span>
                </button>

                <button
                  onClick={() => handleDelete(meeting.id)}
                  className="inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1 hover:text-white focus:outline-none focus:ring active:text-opacity-75 btn btn-danger"
                >
                  <span className="block rounded-full bg-white px-4 py-2 text-xs font-medium hover:bg-transparent text-black">
                    Delete
                  </span>
                </button>

                <button
                  onClick={() => handleEdit(meeting.id)}
                  className="inline-block rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1 hover:text-white focus:outline-none focus:ring active:text-opacity-75 btn btn-primary"
                >
                  <span className="block rounded-full bg-white px-4 py-2 text-xs font-medium hover:bg-transparent">
                    Edit
                  </span>
                </button>
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
