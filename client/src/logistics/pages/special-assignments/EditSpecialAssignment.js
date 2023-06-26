import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");
};

const EditSpecialAssignment = () => {
  const { id } = useParams();
  const sAId = id;
  const [pickupLocation, setPickupLocation] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [destination, setDestination] = useState("");
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [driver, setDriver] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState("");
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

  useEffect(() => {
    fetchSA();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSA = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/special-assignments/${sAId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setPickupLocation(data.pickup_location);
      setAssignedTo(data.assigned_to);
      setDriver(data.driver_id);
      setReason(data.reason);
      setRemarks(data.remarks);
      setVehicle(data.vehicle_id);
      setReservationTime(data.reservation_time);
      setReservationDate(data.reservation_date);
      setDestination(data.destination);
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
      pickup_location: pickupLocation,
      reservation_date: formatDate(reservationDate),
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
        `https://workspace.optiven.co.ke/api/special-assignments/${sAId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(vehicleData),
        }
      );

      const data = await response.json();
      console.log(data);
      setLoading(false);
      navigate("/view-special-assignments");
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
              value={formatDate(reservationDate)}
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

export default EditSpecialAssignment;
