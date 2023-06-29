import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import formatTime from "../../utils/formatTime";
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
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    // Fetch visitor data from the server
    const fetchVisitors = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/visitors", {
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
        `http://localhost:8080/api/visitors/checkout/${visitorId}`,
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

  console.log(visitors);

  return (
    <Sidebar>
      <div className="container px-4 py-6 mx-auto">
        <div className="overflow-x-auto card bg-base-100 shadow-xl">
          <table className="table table-compact">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
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
              {visitors.map((visitor, i) => (
                <tr key={visitor.id}>
                  <td>{i + 1}</td>
                  <td>{visitor.name}</td>
                  <td>{visitor.phone}</td>
                  <td>{visitor.email}</td>
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
                        <Link
                          to={`/edit-visitor/${visitor.id}`} // Link to the EditVisitor component with visitorId as query parameter
                          className="btn btn-warning btn-sm"
                        >
                          Edit
                        </Link>
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
