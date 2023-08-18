import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditMeeting = () => {
  const { id } = useParams();
  const meetingId = id;
  const [clientName, setClientName] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-meeting/${meetingId}`);
  };

  const fetchMeeting = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/meetings/${meetingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setClientName(data.client_name);
      setClientNumber(data.client_number);
      setArrivalTime(data.arrival_time);
      setMeetingDate(data.meeting_date);
      setPurpose(data.purpose);
      setRoom(data.room);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const meetingData = {
      client_name: clientName,
      client_number: clientNumber,
      arrival_time: arrivalTime,
      meeting_date: meetingDate,
      purpose,
      room,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/meetings/${meetingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(meetingData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("Meeting updated successfully.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/view-meetings");
      } else {
        toast.error("Failed to update meeting.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error updating meeting:", data.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the meeting.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error updating meeting:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Sidebar>
        <section className="bg-white">
          <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
            <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
              <img
                alt="Night"
                src="https://images.unsplash.com/photo-1638184984605-af1f05249a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="hidden lg:relative lg:block lg:p-12">
                <div className="block text-white text-4xl">🛎️</div>
                <h2 className="mt-6 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl uppercase">
                  Optiven Visitors Management Platform
                </h2>
              </div>
            </section>
            <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
              <div className="max-w-xl lg:max-w-3xl">
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 grid grid-cols-6 gap-6"
                >
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="ClientName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Client Name
                    </label>
                    <input
                      type="text"
                      id="ClientName"
                      name="client_name"
                      placeholder="Type here"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="input input-bordered input-success w-full max-w-xs"
                    />
                  </div>
                  {/* Repeat similar blocks for other form fields */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="ClientNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Client Phone Number
                    </label>
                    <input
                      type="text"
                      id="ClientNumber"
                      name="client_number"
                      placeholder="Type here"
                      value={clientNumber}
                      onChange={(e) => setClientNumber(e.target.value)}
                      className="input input-bordered input-success w-full max-w-xs"
                    />
                  </div>
                  {/* Repeat similar blocks for other form fields */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="Purpose"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Purpose
                    </label>
                    <input
                      type="text"
                      id="Purpose"
                      name="purpose"
                      placeholder="Type here"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="input input-bordered input-success w-full max-w-xs"
                    />
                  </div>
                  {/* Repeat similar blocks for other form fields */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="ArrivalTime"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Estimated Arrival Time
                    </label>
                    <input
                      type="time"
                      id="ArrivalTime"
                      name="arrival_time"
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="input input-bordered input-success w-full max-w-xs"
                    />
                  </div>
                  {/* Repeat similar blocks for other form fields */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="MeetingDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Meeting Date
                    </label>
                    <input
                      type="date"
                      id="MeetingDate"
                      name="meeting_date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="input input-bordered input-success w-full max-w-xs"
                    />
                  </div>
                  {/* Repeat similar blocks for other form fields */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="Room"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Room
                    </label>
                    <input
                      type="text"
                      id="Room"
                      name="room"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      className="input input-bordered input-success w-full max-w-xs"
                    />
                  </div>
                  {/* Repeat similar blocks for other form fields */}
                  <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                    <button
                      type="submit"
                      className="btn btn-outline btn-success"
                      disabled={loading}
                    >
                      {loading ? "Editing..." : "Edit Meeting"}
                    </button>
                    {error && (
                      <p className="mt-4 text-sm text-red-500">{error}</p>
                    )}
                  </div>
                </form>
              </div>
            </main>
          </div>
        </section>
      </Sidebar>
    </>
  );
                    };  

export default EditMeeting;
