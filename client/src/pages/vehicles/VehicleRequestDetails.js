import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import format12HourTime from "../../utils/formatTime";

const VehicleRequestDetails = () => {
  const [vehicleRequestData, setvehicleRequestData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchVehicleRequest = async (id) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/vehicle-requests/pending-vehicle-requests/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("vehicle request: ", data);
        setvehicleRequestData(data);
        setIsApproved(data.status === "approved");
      } catch (error) {
        console.error("Error fetching vehicle request:", error);
      }
    };

    fetchVehicleRequest(id);
  }, [id, token]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/vehicles/available",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("vehicles: ", data);
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, [token]);

  const approveVehicleRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/vehicle-requests/approve-vehicle-request/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setIsApproved(true);
      } else {
        console.error("Error approving vehicle request:", data.message);
      }
    } catch (error) {
      console.error("Error approving vehicle request:", error);
    }
  };

  const assignVehicleToVehicleRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/vehicle-requests/assign-vehicle-to-request/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ vehicle_id: vehicle }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Vehicle assigned to vehicle request successfully.");
        navigate("/vehicle-requests");
      } else {
        console.error(
          "Error assigning vehicle to vehicle request:",
          data.message
        );
        alert(data.message);
      }
    } catch (error) {
      console.error("Error assigning vehicle to vehicle request:", error);
    }
  };

  return (
    <>
      <Sidebar>
        <div className="flex flex-col justify-center items-center">
          {vehicleRequestData ? (
            <>
              <div className="flex flex-col mx-4">
                <div className="card rounded bg-base-100 shadow-xl p-10 my-4">
                  <h1 className="text-black font-bold">
                    Requester:{" "}
                    <span className="font-bold text-primary">
                      {vehicleRequestData.requester_name}
                    </span>
                  </h1>
                  <h1 className="text-black font-bold">
                    Destination:{" "}
                    <span className="font-bold text-primary">
                      {vehicleRequestData.destination_location}
                    </span>
                  </h1>
                  <h1 className="text-black font-bold">
                    Pickup Location:{" "}
                    <span className="font-bold text-primary">
                      {vehicleRequestData.pickup_location}
                    </span>
                  </h1>
                  <h1 className="text-black font-bold">
                    Purpose:{" "}
                    <span className="font-bold text-primary">
                      {vehicleRequestData.purpose}
                    </span>
                  </h1>
                  <h1 className="text-black font-bold">
                    Date (DD/MM/YYYY):{" "}
                    <span className="font-bold text-primary">
                      {new Date(
                        vehicleRequestData.pickup_date
                      ).toLocaleDateString("en-GB")}
                    </span>
                  </h1>
                  <h1 className="text-black font-bold">
                    Time:{" "}
                    <span className="font-bold text-primary">
                      {format12HourTime(vehicleRequestData.pickup_time)}
                    </span>
                  </h1>
                  <h1 className="text-black font-bold">
                    Number of passengers:{" "}
                    <span className="font-bold text-primary">
                      {vehicleRequestData.number_of_passengers}
                    </span>
                  </h1>
                  <button
                    className="btn btn-outline btn-primary mt-4"
                    onClick={approveVehicleRequest}
                  >
                    Accept vehicle Request
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="label">Assign vehicle:</label>
                <select
                  id="vehicle"
                  as="select"
                  value={vehicle}
                  onChange={(event) => setVehicle(event.target.value)}
                  className="select select-bordered"
                  disabled={!isApproved}
                >
                  <option value="">Select a Vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} - {v.number_of_seats} seats -{" "}
                      {v.vehicle_registration}
                    </option>
                  ))}
                </select>
                {isApproved && (
                  <button
                    className="btn btn-outline btn-primary mt-2"
                    onClick={assignVehicleToVehicleRequest}
                  >
                    Assign Vehicle
                  </button>
                )}
              </div>
            </>
          ) : (
            <p>Loading vehicle data...</p>
          )}
        </div>
      </Sidebar>
    </>
  );
};

export default VehicleRequestDetails;
