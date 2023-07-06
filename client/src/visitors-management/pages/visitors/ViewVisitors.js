import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import formatTime from "../../../utils/formatTime";
import { Link } from "react-router-dom";

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

const ViewVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    // Fetch visitor data from the server
    const fetchVisitors = async () => {
      try {
        const response = await fetch("https://workspace.optiven.co.ke/api/visitors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Visitors:", data); // Debugging statement

        // Update visitors state only if the response data is an array
        if (Array.isArray(data)) {
          setVisitors(data);
        } else {
          console.error("Invalid response format. Expected an array.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchVisitors();
  }, [token]);

  const handleCheckOut = async (visitorId) => {
    try {
      const currentTime = new Date();
      const hours = currentTime.getHours().toString().padStart(2, "0");
      const minutes = currentTime.getMinutes().toString().padStart(2, "0");
      const seconds = currentTime.getSeconds().toString().padStart(2, "0");
      const currentTimeString = `${hours}:${minutes}:${seconds}`;

      const response = await fetch(
        `https://workspace.optiven.co.ke/api/visitors/checkout/${visitorId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ check_out_time: currentTimeString }),
        }
      );

      if (response.ok) {
        // Update the visitor's check-out time in the state
        setVisitors((prevVisitors) =>
          prevVisitors.map((visitor) =>
            visitor.id === visitorId
              ? { ...visitor, check_out_time: currentTimeString }
              : visitor
          )
        );
      } else {
        console.error("Failed to check out visitor.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteVisitor = (visitorId) => {
    // Send a DELETE request to the server to delete the vehicle with the specified ID
    fetch(`https://workspace.optiven.co.ke/api/visitors/${visitorId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Remove the vehicle from the visitors state
        setVisitors((prevVisitors) =>
          prevVisitors.filter((visitor) => visitor.id !== visitorId)
        );
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sidebar>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex justify-center mb-4">
          <input
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2 mr-2 w-72"
            placeholder="Search visitor by name"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="btn btn-primary">Search</button>
        </div>
        <div className="overflow-x-auto card bg-base-100 shadow-xl">
          <table className="table table-compact">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Staff Name</th>
                <th>Visitor Room</th>
                <th>Vehicle Registration</th>
                <th>Purpose</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check-in Time</th>
                <th>Check-out Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Render visitor data */}
              {filteredVisitors.map((visitor, i) => (
                <tr key={visitor.id}>
                  <td>{i + 1}</td>
                  <td>{visitor.name}</td>
                  <td>{visitor.phone}</td>
                  <td>{visitor.email}</td>
                  <td>{visitor.staff_name}</td>
                  <td>{visitor.visitor_room}</td>
                  <td>{visitor.vehicle_registration}</td>
                  <td>{visitor.purpose}</td>
                  <td>{visitor.department}</td>
                  <td>{formatDate(visitor.check_in_date)}</td>
                  <td className="text-center">
                    {formatTime(visitor.check_in_time)}
                  </td>
                  <td>
                    {visitor.check_out_time ? (
                      formatTime(visitor.check_out_time)
                    ) : (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleCheckOut(visitor.id)}
                        disabled={visitor.check_out_time !== null}
                      >
                        Check Out
                      </button>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {visitor.check_out_time === null && (
                        <>
                          <Link
                            to={`/edit-visitor/${visitor.id}`} // Link to the EditVisitor component with visitorId as query parameter
                            className="btn btn-warning btn-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteVisitor(visitor.id)}
                            className="btn btn-error text-white btn-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
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

export default ViewVisitors;
