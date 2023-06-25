import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateSpecialAssignment = () => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [reservationDate, setReservationDate] = useState(null);
  const [reservationTime, setReservationTime] = useState(null);
  const [destination, setDestination] = useState(null);
  const [reason, setReason] = useState(null);
  const [remarks, setRemarks] = useState(null);
  const [assignedTo, setAssignedTo] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [driver, setDriver] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();

  // fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/vehicles/available",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Vehicles: ", data);
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, [token]);

  // fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/drivers/all-drivers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Drivers: ", data);
        setDrivers(data.map((driver) => ({ ...driver, id: driver.driver_id })));
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const vehicleData = {
      pickup_location: pickupLocation,
      reservation_date: reservationDate,
      destination: destination,
      reason: reason,
      reservation_time: reservationTime,
      vehicle_id: vehicle,
      remarks: remarks,
      driver_id: driver,
      status: "pending",
      assigned_to: assignedTo,
    };
    try {
      const response = await fetch(
        "http://localhost:8080/api/special-assignments",
        {
          method: "POST",
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
      navigate("/logistics-home");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar>
        <div className="hero my-10">
          <form
            onSubmit={handleSubmit}
            className="form-control w-full max-w-xs"
          >
            <label htmlFor="assignedTo" className="label">
              <span className="label-text font-bold">Assigned To</span>
            </label>
            <input
              type="text"
              id="assignedTo"
              placeholder="Conversion Team"
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="pickupLocation" className="label">
              <span className="label-text font-bold">Pickup Location</span>
            </label>
            <input
              type="text"
              id="pickupLocation"
              placeholder="ABSA Towers"
              value={pickupLocation}
              onChange={(event) => setPickupLocation(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="destination" className="label">
              <span className="label-text font-bold">Destination</span>
            </label>
            <input
              type="text"
              id="destination"
              placeholder="Nanyuki"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="reservationDate" className="label">
              <span className="label-text font-bold">Reservation Date</span>
            </label>
            <input
              type="date"
              id="reservationDate"
              value={reservationDate}
              onChange={(event) => setReservationDate(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="reservationTime" className="label">
              <span className="label-text font-bold">Reservation Time</span>
            </label>
            <input
              type="time"
              id="reservationTime"
              value={reservationTime}
              onChange={(event) => setReservationTime(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="driver" className="label font-bold">
              Assign a Driver
            </label>
            <select
              id="driver"
              as="select"
              value={driver}
              onChange={(event) => {
                setDriver(event.target.value);
              }}
              className="select select-bordered"
            >
              <option value="">Select a driver</option>
              {drivers.map((driver) => (
                <option key={crypto.randomUUID()} value={driver.user_id}>
                  {driver.fullnames}
                </option>
              ))}
            </select>
            <label className="label font-bold">Assign Vehicle</label>
            <select
              id="vehicle"
              as="select"
              value={vehicle}
              onChange={(event) => setVehicle(event.target.value)}
              className="select select-bordered"
            >
              <option value="">Select a Vehicle</option>
              {vehicles.map((v) => (
                <option key={crypto.randomUUID()} value={v.id}>
                  {v.vehicle_registration}
                </option>
              ))}
            </select>
            <label htmlFor="vehicleBodyType" className="label">
              <span className="label-text font-bold">Reason</span>
            </label>
            <textarea
              type="text"
              id="reason"
              placeholder="Reason..."
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="textarea textarea-bordered w-full max-w-xs"
            />
            <label htmlFor="remarks" className="label">
              <span className="label-text font-bold">Remarks</span>
            </label>
            <textarea
              type="text"
              id="remarks"
              placeholder="Remarks..."
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              className="textarea textarea-bordered w-full max-w-xs"
            />
            <button
              type="submit"
              disabled={loading}
              id="submit"
              className="btn btn-primary w-full max-w-xs mt-4 text-white"
            >
              {loading ? "Creating..." : "Create Special Assignment"}
            </button>
          </form>
        </div>
      </Sidebar>
    </>
  );
};

export default CreateSpecialAssignment;
