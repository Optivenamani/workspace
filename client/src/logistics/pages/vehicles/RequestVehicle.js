import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      purpose: purpose,
    };
    try {
      const response = await fetch(
        "https://workspace.optiven.co.ke/api/vehicle-requests/create-vehicle-request",
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
      toast.success("Vehicle request created successfully!", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/logistics-home");
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Error vehicle request. Please try again.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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
              placeholder="eg. ABSA Towers"
              onChange={(event) => setLocation(event.target.value)}
              className="input input-bordered w-full max-w-xs"
              required
            />
            <label htmlFor="destination" className="label">
              <span className="label-text font-bold">Destination</span>
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              placeholder="eg. Kitengela"
              onChange={(event) => setDestination(event.target.value)}
              className="input input-bordered w-full max-w-xs"
              required
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
              required
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
              min={1}
              onChange={(event) => setPassengers(event.target.value)}
              className="input input-bordered w-full max-w-xs"
              required
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
              required
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
              required
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
