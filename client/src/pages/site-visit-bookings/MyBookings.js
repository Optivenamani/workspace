import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

const MyBookings = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const siteVisits = [
    {
      siteName: "Site A",
      pickupLocation: "Location A",
      date: "2023-04-05",
      time: "10:00 AM",
      status: "Pending",
      clientName: "Jean-Luc Picard",
    },
    {
      siteName: "Site B",
      pickupLocation: "Location B",
      date: "2023-04-06",
      time: "2:00 PM",
      status: "Complete",
      clientName: "Gabrielle Dupont",
    },
    {
      siteName: "Site C",
      pickupLocation: "Location C",
      date: "2023-04-07",
      time: "11:00 AM",
      status: "Complete",
      clientName: "Lucie Chevalier",
    },
    {
      siteName: "Site D",
      pickupLocation: "Location D",
      date: "2023-04-08",
      time: "9:00 AM",
      status: "Rejected",
      clientName: "Pierre Leblanc",
    },
    {
      siteName: "Site E",
      pickupLocation: "Location E",
      date: "2023-04-09",
      time: "3:00 PM",
      status: "Complete",
      clientName: "Sophie Martin",
    },
  ];

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const filteredSiteVisits = siteVisits.filter((item) => {
    const itemDate = new Date(item.date);
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
      <div className="container px-4 py-6 mx-auto">
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
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Site Name</th>
                <th>Pickup Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Client Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* rows */}
              {filteredSiteVisits.map((siteVisit, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{siteVisit.siteName}</td>
                  <td>{siteVisit.pickupLocation}</td>
                  <td>{siteVisit.date}</td>
                  <td>{siteVisit.time}</td>
                  <td
                    style={{
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      color:
                        siteVisit.status === "Rejected"
                          ? "red"
                          : siteVisit.status === "Complete"
                          ? "green"
                          : "black",
                    }}
                  >
                    {siteVisit.status}
                  </td>
                  <td>{siteVisit.clientName}</td>
                  <td>
                    {siteVisit.status === "Pending" ? (
                      <button className="btn btn-sm btn-warning text-white">
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
