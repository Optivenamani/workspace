import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import format12HourTime from "../../utils/formatTime";

const AssignedBookings = () => {
  const [siteVisits, setSiteVisits] = useState([]);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/drivers/assigned-site-visits",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setSiteVisits(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchTrips();
  }, [token]);

  const startTrip = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/site-visits/start-trip/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedSiteVisits = siteVisits.map((sv) =>
          sv.id === id ? { ...sv, status: "in_progress" } : sv
        );
        setSiteVisits(updatedSiteVisits);
        alert("site visit set to in progress");
      } else {
        const data = await response.json();
        console.error("Error starting trip:", data.message);
      }
    } catch (error) {
      console.error("Error starting trip:", error);
    }
  };

  const endTrip = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/site-visits/end-trip/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedSiteVisits = siteVisits.filter((sv) => sv.id !== id);
        setSiteVisits(updatedSiteVisits);
        alert("site visit set to complete");
      } else {
        const data = await response.json();
        console.error("Error ending trip:", data.message);
      }
    } catch (error) {
      console.error("Error ending trip:", error);
    }
  };

  return (
    <>
      <Sidebar>
        <div className="flex justify-center">
          <div className="container px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {siteVisits.map((sv, i) => (
                <div
                  key={sv.id}
                  className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
                >
                  <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

                  <div className="sm:flex sm:justify-between sm:gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                        {sv.pickup_location}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-gray-600">
                        <span className="font-bold">Site Name: </span>{" "}
                        {sv.site_name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="max-w-[40ch] text-sm">
                      <span className="font-bold">Passengers: </span>
                      {sv.total_passengers}
                    </p>
                  </div>

                  <dl className="mt-6 flex gap-4 sm:gap-6">
                    <div className="flex flex-col-reverse">
                      <dt className="text-sm font-medium text-gray-600">
                        {new Date(sv.pickup_date).toLocaleDateString("en-GB")}
                      </dt>
                      <dd className="text-xs font-bold">Pickup Date</dd>
                    </div>

                    <div className="flex flex-col-reverse">
                      <dt className="text-sm font-medium text-gray-600">
                        {format12HourTime(sv.pickup_time)}
                      </dt>
                      <dd className="text-xs font-bold">Pickup Time</dd>
                    </div>

                    <div className="flex flex-col-reverse">
                      <button
                        className={`btn ${
                          sv.status === "in_progress"
                            ? "btn-error"
                            : "btn-primary"
                        } text-white`}
                        onClick={() =>
                          sv.status === "in_progress"
                            ? endTrip(sv.id)
                            : startTrip(sv.id)
                        }
                      >
                        {sv.status === "in_progress"
                          ? "End Trip"
                          : "Start Trip"}
                      </button>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default AssignedBookings;
