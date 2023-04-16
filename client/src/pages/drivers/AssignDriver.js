import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar";

const AssignDriver = () => {
  const [vehicle, setVehicle] = useState("");
  const [driver, setDriver] = useState("");
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const token = useSelector((state) => state.user.token);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    const fetchVehicles = async () => {
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
    };

    fetchVehicles();
  }, [token]);

  console.log("vehicles: ", vehicles);

  const drivers = users.filter((user) => user.Accessrole === "driver69");

  console.log("drivers: ", drivers);

  const assignDriverToVehicle = async (vehicleId, driverId) => {
    try {
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
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error assigning driver to vehicle:", error);
    }
  };

  return (
    <>
      <Sidebar>
        {/* implement select input showing all vehicles with marketers + clients inside in the div below */}
        <select
          id="vehicle"
          as="select"
          value={vehicle}
          onChange={(event) => setVehicle(event.target.value)}
          className="select select-bordered"
        >
          <option value="">Select a vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.make} {vehicle.model} {vehicle.vehicle_registration}
            </option>
          ))}
        </select>
        {/* select showing all available drivers */}
        <select
          id="driver"
          as="select"
          value={driver}
          onChange={(event) => setDriver(event.target.value)}
          className="select select-bordered"
        >
          <option value="">Select a driver</option>
          {drivers.map((driver) => (
            <option key={driver.user_id} value={driver.user_id}>
              {driver.fullnames}
            </option>
          ))}
        </select>
        <button
          className="btn"
          onClick={() => assignDriverToVehicle(vehicle, driver)}
        >
          Assign
        </button>
      </Sidebar>
    </>
  );
};

export default AssignDriver;
