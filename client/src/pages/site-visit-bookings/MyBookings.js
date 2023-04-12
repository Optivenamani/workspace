import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar";
import format12HourTime from "../../utils/formatTime";

const MyBookings = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [siteVisits, setSiteVisits] = useState([]);
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user.user_id);

  useEffect(() => {
    const fetchSiteVisits = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/site-visits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setSiteVisits(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchSiteVisits();
  }, [token]);

  const userSiteVisits = siteVisits.filter(
    (siteVisit) => siteVisit.created_by === userId
  );

  console.log(userSiteVisits);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const filteredSiteVisits = userSiteVisits.filter((item) => {
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
                <th></th>
                <th>Site Name</th>
                <th>Pickup Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Number of clients</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* rows */}
              {filteredSiteVisits.map((siteVisit, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{siteVisit.site_name}</td>
                  <td>{siteVisit.pickup_location}</td>
                  <td>
                    {new Date(siteVisit.pickup_date).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>

                  <td>{format12HourTime(siteVisit.pickup_time)}</td>

                  <td
                    style={{
                      fontStyle: "italic",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      color:
                        siteVisit.status === "REJECTED"
                          ? "red"
                          : siteVisit.status === "IN_PROGRESS"
                          ? "green"
                          : "blue",
                    }}
                  >
                    {siteVisit.status}
                  </td>
                  <td>{siteVisit.clients.length}</td>
                  <td>
                    {siteVisit.status === "PENDING" ? (
                      <button className="btn btn-sm btn-outline btn-warning">
                        Edit
                      </button>
                    ) : null}
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

export default MyBookings;
