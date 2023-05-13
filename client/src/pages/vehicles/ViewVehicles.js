import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import huh from "../../assets/app-illustrations/Shrug-bro.png";

const ViewVehicles = () => {
  const [query, setQuery] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch("https://workspace.optiven.co.ke/api/vehicles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicle:", error);
      }
    };

    fetchVehicle();
  }, [token]);

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicle_registration.toLowerCase().includes(query.toLowerCase())
  );

  const editVehicle = (vehicleId) => {
    // Navigate to the edit vehicle page with the vehicle ID as a parameter
    navigate(`/vehicles/${vehicleId}`);
  };

  const deleteVehicle = (vehicleId) => {
    const token = localStorage.getItem("token");
    // Send a DELETE request to the server to delete the vehicle with the specified ID
    fetch(`https://workspace.optiven.co.ke/api/vehicles/${vehicleId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Remove the vehicle from the vehicles state
        setVehicles((prevvehicles) =>
          prevvehicles.filter((vehicle) => vehicle.id !== vehicleId)
        );
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };
  return (
    <>
      <Sidebar>
        <div className="flex justify-center items-center mt-2 mb-2">
          <input
            placeholder="Search Vehicle By Reg. Number"
            className="input input-bordered w-full max-w-xs"
            type="text"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {filteredVehicles.length > 0 ? (
          <div className="px-4 mt-4 flex justify-center">
            <div className="overflow-x-auto w-screen card bg-base-100 shadow-xl">
              <table className="table table-zebra w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Body Type</th>
                    <th>Passenger Capacity</th>
                    <th>Engine Capacity(CC)</th>
                    <th>Vehicle Registration</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* rows */}
                  {filteredVehicles.map((vehicle, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{vehicle.make}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.body_type}</td>
                      <td>{vehicle.number_of_seats}</td>
                      <td>{vehicle.engine_capacity}</td>
                      <td>{vehicle.vehicle_registration}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning mr-2 text-white"
                          onClick={() => editVehicle(vehicle.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-error text-white"
                          onClick={() => deleteVehicle(vehicle.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex flex-col items-center mt-20">
              <img src={huh} alt="huh" className="lg:w-96" />
              <h1 className="font-bold text-center">Vehicle not found.</h1>
            </div>
          </div>
        )}
      </Sidebar>
    </>
  );
};

export default ViewVehicles;
