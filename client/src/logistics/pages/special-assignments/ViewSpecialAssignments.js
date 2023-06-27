import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import formatTime from "../../../utils/formatTime";

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

const ViewSpecialAssignments = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [specialAssignments, setSpecialAssignments] = useState([]);
  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecialAssignments = async () => {
      try {
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/special-assignments",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setSpecialAssignments(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchSpecialAssignments();
  }, [token]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const filteredSpecialAssignments = specialAssignments.filter((sA) => {
    const sADate = new Date(sA.reservation_date);
    const startDateObj = startDate && new Date(startDate);
    const endDateObj = endDate && new Date(endDate);

    if (startDateObj && endDateObj) {
      return sADate >= startDateObj && sADate <= endDateObj;
    } else if (startDate) {
      return sADate >= startDateObj;
    } else if (endDateObj) {
      return sADate <= endDateObj;
    } else {
      return true;
    }
  });

  const editSA = (specialAssignmentId) => {
    // Navigate to the edit sA page with the sA ID as a parameter
    navigate(`/special-assignment/${specialAssignmentId}`);
  };

  // const deleteSA = (specialAssignmentId) => {
  //   // Send a DELETE request to the server to delete the sA with the specified ID
  //   fetch(
  //     `https://workspace.optiven.co.ke/api/special-assignments/${specialAssignmentId}`,
  //     {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       // Remove the sA from the sAs state
  //       setSpecialAssignments((prevSAs) =>
  //         prevSAs.filter((sA) => sA.id !== specialAssignmentId)
  //       );
  //     })
  //     .catch((error) => {
  //       console.error("There was a problem with the fetch operation:", error);
  //     });
  // };

  return (
    <>
      <Sidebar>
        <div className="container px-4 py-4 pb-6 mx-auto">
          <div className="flex justify-center items-center my-4">
            <div className="flex space-x-2 items-center">
              <input
                type="date"
                className="input input-bordered max-w-xs mt-2"
                value={startDate}
                onChange={handleStartDateChange}
              />
              <span className="text-lg font-bold">to</span>
              <input
                type="date"
                className="input input-bordered max-w-xs mt-2"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>
          <div className="overflow-x-auto card bg-base-100 shadow-xl">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Assigned to</th>
                  <th>Destination</th>
                  <th>Pickup Location</th>
                  <th>Reason</th>
                  <th>Remarks</th>
                  <th>Reservation Date</th>
                  <th>Reservation Time</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSpecialAssignments
                  .sort((a, b) => b.id - a.id)
                  .map((sA, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{sA.assigned_to}</td>
                      <td>{sA.destination}</td>
                      <td>{sA.pickup_location}</td>
                      <td>{sA.reason}</td>
                      <td>{sA.remarks}</td>
                      <td>{formatDate(sA.reservation_date)}</td>
                      <td>{formatTime(sA.reservation_time)}</td>
                      <td>{sA.vehicle_registration}</td>
                      <td>{sA.driver_name}</td>
                      <td className="font-bold italic">
                        {sA.status.toUpperCase()}
                      </td>
                      <td>
                        {sA.status.toLowerCase() === "pending" && (
                          <>
                            <button
                              className="btn btn-sm btn-warning mr-2 text-white"
                              onClick={() => editSA(sA.id)}
                            >
                              Edit
                            </button>
                          </>
                        )}
                        {/* {sA.status.toLowerCase() === "completed" && (
                          <>
                            <button
                              className="btn btn-error text-white"
                              onClick={() => deleteSA(sA.id)}
                            >
                              Delete
                            </button>
                          </>
                        )} */}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default ViewSpecialAssignments;
