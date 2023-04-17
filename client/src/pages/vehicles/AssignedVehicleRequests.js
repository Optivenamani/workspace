import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import format12HourTime from "../../utils/formatTime";

const AssignedVehicleRequests = () => {
  const [vehicleRequests, setVehicleRequests] = useState([]);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/drivers/assigned-vehicle-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log(data);
        setVehicleRequests(data);
      } catch (error) {
        console.error("Error fetching vehicle requests:", error);
      }
    };

    fetchTrips();
  }, [token]);

  const startTrip = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/vehicle-requests/start-trip/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedVehicleRequests = vehicleRequests.map((vr) =>
          vr.id === id ? { ...vr, status: "in_progress" } : vr
        );
        setVehicleRequests(updatedVehicleRequests);
        alert("vehicle request set to in progress");
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
        `http://localhost:8080/api/vehicle-requests/end-trip/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedVehicleRequests = vehicleRequests.filter(
          (vr) => vr.id !== id
        );
        setVehicleRequests(updatedVehicleRequests);
        alert("vehicle request set to complete");
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
              {vehicleRequests.map((vr, i) => (
                <div
                  key={vr.id}
                  className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8"
                >
                  <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

                  <div className="sm:flex sm:justify-between sm:gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                        {vr.pickup_location}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-gray-600">
                        <span className="font-bold">Destination: </span>{" "}
                        {vr.destination_location}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-6 flex gap-4 sm:gap-6">
                    <div className="flex flex-col-reverse">
                      <dt className="text-sm font-medium text-gray-600">
                        {new Date(vr.pickup_date).toLocaleDateString("en-GB")}
                      </dt>
                      <dd className="text-xs font-bold">Pickup Date</dd>
                    </div>

                    <div className="flex flex-col-reverse">
                      <dt className="text-sm font-medium text-gray-600">
                        {format12HourTime(vr.pickup_time)}
                      </dt>
                      <dd className="text-xs font-bold">Pickup Time</dd>
                    </div>
                    <div className="flex flex-col-reverse">
                      <button
                        className={`btn ${
                          vr.status === "in_progress"
                            ? "btn-error"
                            : "btn-primary"
                        } text-white`}
                        onClick={() =>
                          vr.status === "in_progress"
                            ? endTrip(vr.id)
                            : startTrip(vr.id)
                        }
                      >
                        {vr.status === "in_progress"
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
export default AssignedVehicleRequests;
