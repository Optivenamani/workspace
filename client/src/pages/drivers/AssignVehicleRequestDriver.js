import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

const AssignVehicleRequestDriver = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState("");
  const [driver, setDriver] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async (id) => {
      try {
        const response = await fetch(`http://localhost:8080/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const users = await response.json();
        const madere = users.filter(
          (user) =>
            user.Accessrole === "driver69" ||
            user.Accessrole === "     112#114#700"
        );
        console.log("madere: ", madere);
        setDrivers(madere);
      } catch (error) {
        console.error("Error fetching madere:", error);
      }
    };

    fetchDrivers();
  }, [token]);

  useEffect(() => {
    const fetchVehicles = async (id) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/vehicle-requests/vehicles-with-passengers-from-requests`,
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
        console.error("Error fetching drivers:", error);
      }
    };

    fetchVehicles();
  }, [token]);

  const assignDriverToVehicle = async (vehicleRequestId) => {
    if (vehicle && driver) {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/vehicle-requests/assign-driver-to-vehicle-request/${vehicleRequestId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ driver_id: driver }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setIsLoading(false);
          navigate("/");
        } else {
          const error = await response.json();
          console.error("Error assigning driver:", error.message);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error assigning driver:", error);
        setIsLoading(false);
      }
    } else {
      alert("Please select a vehicle and a driver before assigning.");
    }
  };
  return (
    <>
      <Sidebar>
        <div className="flex justify-center">
          <div className="form-control w-full max-w-xs my-20">
            <label className="label">
              <span className="label-text font-bold">Select Vehicle</span>
            </label>
            <select
              id="vehicle"
              as="select"
              value={vehicle ? vehicle.id : ""}
              onChange={(event) => {
                const selectedIndex = event.target.options.selectedIndex;
                const vehicleRequestId =
                  event.target.options[selectedIndex].getAttribute(
                    "data-vr-id"
                  );
                setVehicle({
                  id: event.target.value,
                  request_id: vehicleRequestId,
                });
              }}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option
                  key={vehicle.id}
                  value={vehicle.id}
                  data-vr-id={vehicle.request_id}
                >
                  {vehicle.make} {vehicle.model} {vehicle.vehicle_registration}
                </option>
              ))}
            </select>
            <label className="label">
              <span className="label-text font-bold">Select Driver</span>
            </label>
            <select
              id="driver"
              as="select"
              value={driver}
              onChange={(event) => setDriver(event.target.value)}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="">Select a driver</option>
              {drivers.map((driver) => (
                <option key={driver.user_id} value={driver.user_id}>
                  {driver.fullnames}
                </option>
              ))}
            </select>
            <label className="label"></label>
            <button
              className="btn btn-primary btn-outline max-w-full"
              onClick={() => {
                if (vehicle) {
                  assignDriverToVehicle(vehicle.request_id);
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner"></span> : "Assign"}
            </button>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default AssignVehicleRequestDriver;
