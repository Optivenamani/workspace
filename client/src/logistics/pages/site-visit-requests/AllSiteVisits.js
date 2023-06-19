import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import formatTime from "../../../utils/formatTime";

const AllSiteVisits = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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

  console.log(siteVisits);

  const filteredSiteVisits = siteVisits.filter((visit) => {
    const visitDate = new Date(visit.pickup_date);
    const startDateObj = startDate && new Date(startDate);
    const endDateObj = endDate && new Date(endDate);

    if (startDateObj && endDateObj) {
      return visitDate >= startDateObj && visitDate <= endDateObj;
    } else if (startDate) {
      return visitDate >= startDateObj;
    } else if (endDateObj) {
      return visitDate <= endDateObj;
    } else {
      return true;
    }
  });

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

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
        <div className="px-4 mt-4 flex justify-center mb-10">
          <div className="overflow-x-auto w-screen card bg-base-100 shadow-xl">
            <table className="table table-zebra w-full">
              {/* head */}
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Marketer</th>
                  <th>Site Visited</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Number of Clients</th>
                </tr>
              </thead>
              <tbody>
                {/* rows */}
                {filteredSiteVisits.map((siteVisit, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{siteVisit.marketer_name.toUpperCase()}</td>
                    <td>{siteVisit.site_name}</td>
                    <td>{siteVisit.pickup_location}</td>
                    <td>
                      {new Date(siteVisit.pickup_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>

                    <td>{formatTime(siteVisit.pickup_time)}</td>
                    <td>{siteVisit.num_clients}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>Index</th>
                  <th>Marketer ID</th>
                  <th>Site Visited</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Number of Clients</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default AllSiteVisits;
