import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar";

const AssignDriver = () => {
  const [vehicle, setVehicle] = useState("");
  const [driver, setDriver] = useState("");
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = useSelector((state) => state.user.token);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const availableUsers = data.filter((user) => user.is_available !== 0);
      setUsers(availableUsers);
    } catch (error) {
      console.error("Error fetching site visits:", error);
    }
  }, [token]);

  const fetchVehicles = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/site-visit-requests/vehicles-with-passengers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  console.log("vehicles: ", vehicles);

  const drivers = users.filter((user) => user.Accessrole === "driver69");

  console.log("drivers: ", drivers);

  const assignDriverToVehicle = async (vehicleId, driverId) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/site-visit-requests/assign-vehicle-driver/${vehicleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: driverId }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        // Refresh the vehicles and drivers list after successful assignment
        fetchVehicles();
        fetchUsers();
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error assigning driver to vehicle:", error);
    } finally {
      setIsLoading(false);
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
              value={vehicle}
              onChange={(event) => setVehicle(event.target.value)}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
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
              onClick={() => assignDriverToVehicle(vehicle, driver)}
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

export default AssignDriver;
