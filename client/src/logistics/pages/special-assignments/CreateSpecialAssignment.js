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
    const specialAssignmentData = {
      project_id: 7,
      special_assignment_assigned_to: assignedTo,
      pickup_location: pickupLocation,
      pickup_date: reservationDate,
      pickup_time: reservationTime,
      remarks: reason,
      vehicle_id: vehicle,
      special_assignment_destination: destination,
      driver_id: driver,
      status: "pending",
      clients: [
        {
          name: "N/A - SA",
          phone_number: "N/A - SA",
          email: "N/A - SA",
        },
      ],
    };
    try {
      const response = await fetch("https://workspace.optiven.co.ke/api/site-visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(specialAssignmentData),
      });

      const data = await response.json();
      console.log(data);
      setLoading(false);
      navigate("/site-visit-requests");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Sidebar>
        <section className="bg-white">
          <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
            <section className="relative flex h-32 items-center bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
              <img
                alt="Night"
                src="https://images.unsplash.com/photo-1638184984605-af1f05249a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div className="hidden lg:relative lg:block lg:p-12">
                <h2 className="mt-6 text-2xl font-extrabold text-white sm:text-3xl md:text-4xl uppercase">
                  Create a Special Assignment
                </h2>
              </div>
            </section>
            <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-8 xl:col-span-6">
              <div className="max-w-xl lg:max-w-3xl">
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 grid grid-cols-6 gap-3"
                >
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="assignedTo" className="label">
                      <span className="label-text font-bold">Assigned To</span>
                    </label>
                    <textarea
                      type="text"
                      id="assignedTo"
                      placeholder="Conversion Team"
                      value={assignedTo}
                      onChange={(event) => setAssignedTo(event.target.value)}
                      className="textarea textarea-bordered w-full max-w-xs"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="pickupLocation" className="label">
                      <span className="label-text font-bold">
                        Pickup Location
                      </span>
                    </label>
                    <textarea
                      type="text"
                      id="pickupLocation"
                      placeholder="ABSA Towers"
                      value={pickupLocation}
                      onChange={(event) =>
                        setPickupLocation(event.target.value)
                      }
                      className="textarea textarea-bordered w-full max-w-xs"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="destination" className="label">
                      <span className="label-text font-bold">Destination</span>
                    </label>
                    <textarea
                      type="text"
                      id="destination"
                      placeholder="Nanyuki"
                      value={destination}
                      onChange={(event) => setDestination(event.target.value)}
                      className="textarea textarea-bordered w-full max-w-xs"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
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
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="reservationDate" className="label">
                      <span className="label-text font-bold">
                        Reservation Date
                      </span>
                    </label>
                    <input
                      type="date"
                      id="reservationDate"
                      value={reservationDate}
                      onChange={(event) =>
                        setReservationDate(event.target.value)
                      }
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="reservationTime" className="label">
                      <span className="label-text font-bold">
                        Reservation Time
                      </span>
                    </label>
                    <input
                      type="time"
                      id="reservationTime"
                      value={reservationTime}
                      onChange={(event) =>
                        setReservationTime(event.target.value)
                      }
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
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
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select a driver</option>
                      {drivers.map((driver) => (
                        <option
                          key={crypto.randomUUID()}
                          value={driver.user_id}
                        >
                          {driver.fullnames}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="label font-bold">Assign Vehicle</label>
                    <select
                      id="vehicle"
                      as="select"
                      value={vehicle}
                      onChange={(event) => setVehicle(event.target.value)}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select a Vehicle</option>
                      {vehicles.map((v) => (
                        <option key={crypto.randomUUID()} value={v.id}>
                          {v.vehicle_registration}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <button
                      type="submit"
                      disabled={loading}
                      id="submit"
                      className="btn btn-primary w-full max-w-xs mt-4 text-white"
                    >
                      {loading ? "Creating..." : "Create Special Assignment"}
                    </button>
                  </div>
                </form>
              </div>
            </main>
          </div>
        </section>
      </Sidebar>
    </>
  );
};

export default CreateSpecialAssignment;
