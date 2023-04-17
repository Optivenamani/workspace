import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RequestVehicle = () => {
  const [location, setLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [purpose, setPurpose] = useState("");
  const [passengers, setPassengers] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = useSelector((state) => state.user.user).user_id;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const vehicleRequestData = {
      requester_id: userId,
      pickup_location: location,
      destination_location: destination,
      pickup_time: time,
      pickup_date: date,
      number_of_passengers: passengers,
    };
    try {
      const response = await fetch(
        "http://localhost:8080/api/vehicle-requests/create-vehicle-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(vehicleRequestData),
        }
      );

      const data = await response.json();
      console.log(data);
      setLoading(false);
      navigate("/");
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
            <label htmlFor="location" className="label">
              <span className="label-text font-bold">Pickup Location</span>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              placeholder="Location"
              onChange={(event) => setLocation(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="destination" className="label">
              <span className="label-text font-bold">Destination</span>
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              placeholder="Destination"
              onChange={(event) => setDestination(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="purpose" className="label">
              <span className="label-text font-bold">Purpose</span>
            </label>
            <input
              type="text"
              id="purpose"
              value={purpose}
              placeholder="Purpose"
              onChange={(event) => setPurpose(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="passengers" className="label">
              <span className="label-text font-bold">
                Number of Passengers (Including yourself)
              </span>
            </label>
            <input
              type="number"
              id="passengers"
              value={passengers}
              placeholder="4"
              onChange={(event) => setPassengers(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="date" className="label">
              <span className="label-text font-bold">Date</span>
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <label htmlFor="time" className="label">
              <span className="label-text font-bold">Time</span>
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
            <button
              type="submit"
              disabled={loading}
              id="submit"
              className="btn btn-primary w-full max-w-xs mt-4 text-white"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>
      </Sidebar>
    </>
  );
};

export default RequestVehicle;
