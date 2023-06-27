import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import formatTime from "../../../utils/formatTime";

const ApprovedBookings = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);  
  const [siteVisits, setSiteVisits] = useState([]);

  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchSiteVisits = async () => {
      try {
        const response = await fetch("https://workspace.optiven.co.ke/api/site-visit-requests", {
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

  const approvedSVRequests = siteVisits.filter(
    (siteVisit) => siteVisit.status === "approved"
  );

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const filteredBookings = approvedSVRequests.filter((item) => {
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
    <>
      <Sidebar>
        <div className="flex justify-center items-center mt-2 mb-2">
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
        <div className="px-4 mt-4 flex justify-center pb-10">
          <div className="overflow-x-auto w-screen card bg-base-100 shadow-xl">
            <table className="table table-zebra w-full">
              {/* head */}
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Site</th>
                  <th>Pickup Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th className="text-center">Number of Clients</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((item, i) => (
                  <tr key={item.id}>
                    <th>{i + 1}</th>
                    <td>{item.site_name}</td>
                    <td>{item.pickup_location}</td>
                    <td>
                      {new Date(item.pickup_date).toLocaleDateString("en-GB")}
                    </td>
                    <td>{formatTime(item.pickup_time)}</td>
                    <td className="text-center">{item.num_clients}</td>
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

export default ApprovedBookings;
