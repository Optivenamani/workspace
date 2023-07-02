import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

const formatTime = (timeString) => {
  if (!timeString) return null;
  const time = new Date(`1970-01-01T${timeString}`);
  return time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

const ViewScheduledInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch interview data from the server
    const fetchInterviews = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/interviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Interviews:", data); // Debugging statement

        // Update interviews state only if the response data is an array
        if (Array.isArray(data)) {
          setInterviews(data);
        } else {
          console.error("Invalid response format. Expected an array.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchInterviews();
  }, [token]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredInterviews = interviews.filter(
    (interview) =>
      (interview.name &&
        interview.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (interview.phone_number && interview.phone_number.includes(searchTerm))
  );

  const deleteInterview = (interviewId) => {
    // Send a DELETE request to the server to delete the vehicle with the specified ID
    fetch(`http://localhost:8080/api/interviews/${interviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Remove the vehicle from the intervieww state
        setInterviews((prevInterviews) =>
          prevInterviews.filter((interview) => interview.id !== interviewId)
        );
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <Sidebar>
      <div className="container px-4 py-2 mx-auto">
        <div className="flex justify-center mb-2">
          <input
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2 mr-2 w-72"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="overflow-x-auto card bg-base-100 shadow-xl">
          <table className="table table-compact">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Interview Date</th>
                <th>Interview Time</th>
                <th>Position</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Render interview data */}
              {filteredInterviews.map((interview, i) => (
                <tr key={interview.id}>
                  <td>{i + 1}</td>
                  <td>{interview.name}</td>
                  <td>{interview.email}</td>
                  <td>{interview.phone_number}</td>
                  <td>{formatDate(interview.interview_date)}</td>
                  <td>{formatTime(interview.interview_time)}</td>
                  <td>{interview.position}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm text-white"
                      onClick={() =>
                        navigate(`/edit-scheduled-interviews/${interview.id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm text-white btn-error ml-1"
                      onClick={() => deleteInterview(interview.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
};

export default ViewScheduledInterviews;
