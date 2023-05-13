import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar";
import formatTime from "../../utils/formatTime";

const PastRequests = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [vehicleRequests, setVehicleRequests] = useState([]);
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user.user_id);

  useEffect(() => {
    const fetchVehicleRequests = async () => {
      try {
        const response = await fetch(
          `https://workspace.optiven.co.ke/api/vehicle-requests/user-vehicle-requests/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setVehicleRequests(data);
      } catch (error) {
        console.error("Error fetching vehicle requests:", error);
      }
    };

    fetchVehicleRequests();
  }, [token, userId]);

  const userVehicleRequests = vehicleRequests.filter(
    (request) =>
      request.requester_id === userId && request.status === "completed"
  );

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const filteredRequests = userVehicleRequests.filter((item) => {
    const itemDate = new Date(item.pickup_date);
    const startDateObj = startDate && new Date(startDate);
    const endDateObj = endDate && new Date(endDate);

    if (startDateObj && endDateObj) {
      return itemDate >= startDateObj && itemDate <= endDateObj;
    } else if (startDate) {
      return itemDate >= startDateObj;
    } else if (endDateObj) {
      return itemDate <= endDateObj;
    } else {
      return true;
    }
  });

  return (
    <Sidebar>
      <div className="container px-4 pb-6 mx-auto">
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
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Index</th>
                <th>Pickup Location</th>
                <th>Destination</th>
                <th>Purpose</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{request.pickup_location}</td>
                  <td>{request.destination_location}</td>
                  <td>{request.purpose}</td>
                  <td>
                    {new Date(request.pickup_date).toLocaleDateString("en-GB")}
                  </td>
                  <td>{formatTime(request.pickup_time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
};

export default PastRequests;
