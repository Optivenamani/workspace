import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";

const EditVehicle = () => {
  const { id } = useParams();
  const vehicleId = id;
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [vehicleBodyType, setVehicleBodyType] = useState("");
  const [vehicleSeats, setVehicleSeats] = useState(0);
  const [vehicleEngineCapacity, setVehicleEngineCapacity] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVehicle = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/vehicles/vehicle/${vehicleId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setVehicleMake(data.make);
      setVehicleModel(data.model);
      setVehicleRegistration(data.vehicle_registration);
      setVehicleBodyType(data.body_type);
      setVehicleSeats(data.number_of_seats);
      setVehicleEngineCapacity(data.engine_capacity);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const vehicleData = {
      make: vehicleMake,
      model: vehicleModel,
      vehicle_registration: vehicleRegistration,
      body_type: vehicleBodyType,
      number_of_seats: vehicleSeats,
      engine_capacity: vehicleEngineCapacity,
    };
    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/vehicles/${vehicleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(vehicleData),
        }
      );

      const data = await response.json();
      console.log(data);
      setLoading(false);
      navigate("/vehicles");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar>
        <div className="hero mt-10">
          <form
            onSubmit={handleSubmit}
            className="form-control w-full max-w-xs"
          >
            <label htmlFor="vehicleMake" className="label">
              <span className="label-text font-bold">Vehicle Make</span>
            </label>
            <input
              type="text"
              id="vehicleMake"
              value={vehicleMake}
              placeholder="Toyota"
              onChange={(event) => setVehicleMake(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="vehicleModel" className="label">
              <span className="label-text font-bold">Vehicle Model</span>
            </label>
            <input
              type="text"
              id="vehicleModel"
              placeholder="Hiace"
              value={vehicleModel}
              onChange={(event) => setVehicleModel(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="vehicleBodyType" className="label">
              <span className="label-text font-bold">Body Type</span>
            </label>
            <select
              id="vehicleBodyType"
              as="select"
              value={vehicleBodyType}
              onChange={(event) => setVehicleBodyType(event.target.value)}
              className="select select-bordered"
            >
              <option value="Bus">Bus</option>
              <option value="Minibus">Minibus</option>
              <option value="Van">Van</option>
              <option value="Minivan">Minivan</option>
              <option value="Truck">Truck</option>
              <option value="Mini Truck">Mini Truck</option>
              <option value="Sedan">Sedan</option>
              <option value="Estate">Estate</option>
              <option value="Hatchback">Hatchback</option>
              <option value="SUV">SUV</option>
              <option value="Other">Other</option>
            </select>
            <label htmlFor="vehicleSeats" className="label">
              <span className="label-text font-bold">Seats</span>
            </label>
            <input
              type="number"
              id="vehicleSeats"
              placeholder="30"
              value={vehicleSeats}
              onChange={(event) => setVehicleSeats(event.target.value)}
              className="input input-bordered w-full max-w-xs"
              required
              min={1}
            />
            <label htmlFor="vehicleEngineCapacity" className="label">
              <span className="label-text font-bold">
                Engine Capacity (CCs)
              </span>
            </label>
            <input
              type="number"
              id="vehicleEngineCapacity"
              placeholder="3000"
              value={vehicleEngineCapacity}
              onChange={(event) => setVehicleEngineCapacity(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="vehicleRegistration" className="label">
              <span className="label-text font-bold">Vehicle Registration</span>
            </label>
            <input
              type="text"
              id="vehicleRegistration"
              placeholder="KDP 666X"
              value={vehicleRegistration}
              onChange={(event) => setVehicleRegistration(event.target.value)}
              className="input input-bordered w-full max-w-xs"
              required
            />
            <button
              type="submit"
              disabled={loading}
              id="submit"
              className="btn btn-primary w-full max-w-xs mt-4 text-white"
            >
              {loading ? "Saving..." : "Edit Vehicle"}
            </button>
          </form>
        </div>
      </Sidebar>
    </>
  );
};

export default EditVehicle;
