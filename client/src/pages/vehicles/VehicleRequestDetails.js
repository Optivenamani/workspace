import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VehicleRequestDetails = () => {
  const [vehicleRequestData, setvehicleRequestData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [, setIsApproved] = useState(false);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [purpose, setPurpose] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [driver, setDriver] = useState("");
  const [destination, setDestination] = useState("");
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const { id } = useParams();

  // fetch all drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(
          "http://209.38.246.14:8080/api/drivers/all-drivers",
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

  // fetch the current vehicle request
  useEffect(() => {
    const fetchVehicleRequest = async (id) => {
      try {
        const response = await fetch(
          `http://209.38.246.14:8080/api/vehicle-requests/pending-vehicle-requests/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("vehicle request: ", data);
        setvehicleRequestData(data);
        setIsApproved(data.status === "approved");
      } catch (error) {
        console.error("Error fetching vehicle request:", error);
      }
    };

    fetchVehicleRequest(id);
  }, [id, token]);

  // fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(
          "http://209.38.246.14:8080/api/vehicles/available",
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
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, [token]);

  // fetch the data of the vehicle request
  useEffect(() => {
    if (vehicleRequestData) {
      setVehicle(vehicleRequestData.vehicle_id);
      setPickupLocation(vehicleRequestData.pickup_location);
      setDate(formatDate(vehicleRequestData.pickup_date));
      setTime(vehicleRequestData.pickup_time);
      setRemarks(vehicleRequestData.remarks);
      setDriver(vehicleRequestData.driver_id);
      setDestination(vehicleRequestData.destination_location);
      setPurpose(vehicleRequestData.purpose);
    }
  }, [vehicleRequestData]);

  // reject vehicle request
  const rejectVehicleRequest = async () => {
    try {
      const requestBody = {
        ...(remarks !== null && { remarks: remarks }),
      };

      const response = await fetch(
        `http://209.38.246.14:8080/api/vehicle-requests/reject-vehicle-request/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast.success("Vehicle request rejected", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/vehicle-requests");
      } else {
        toast.error("Error rejecting vehicle request", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error rejecting vehicle request: ", data.message);
      }
    } catch (error) {
      console.error("Error rejecting vehicle request:", error);
    }
  };

  // approve/edit vehicle request
  const approveVehicleRequest = async () => {
    try {
      const requestBody = {
        ...(vehicle !== "" && { vehicle_id: parseInt(vehicle) }),
        ...(pickupLocation !== "" && { pickup_location: pickupLocation }),
        ...(date !== null && { pickup_date: date }),
        ...(time !== null && { pickup_time: time }),
        ...(driver !== "" && { driver_id: parseInt(driver) }),
        ...(remarks !== null && { remarks: remarks }),
        ...(purpose !== null && { purpose: purpose }),
        ...(destination !== null && {
          destination_location: destination,
        }),
        status: "approved",
      };

      console.log("Request object: ", requestBody);

      const response = await fetch(
        `http://209.38.246.14:8080/api/vehicle-requests/pending-vehicle-requests/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );
      const data = await response.json();
      console.log("Data:", data);
      if (response.ok) {
        toast.success("Vehicle request updated successfully.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/vehicle-requests");
      } else {
        toast.error("An error occurred while updating the vehicle request.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error updating vehicle request:", data.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the vehicle request.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error updating vehicle request:", error);
    }
  };

  // format date
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

  return (
    <>
      <Sidebar>
        {vehicleRequestData ? (
          <div>
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
              <div className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                <img
                  alt="Night"
                  src="https://images.pexels.com/photos/2387532/pexels-photo-2387532.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
              </div>

              <main
                aria-label="Main"
                className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
              >
                <div className="max-w-xl lg:max-w-3xl">
                  <div action="#" className=" grid grid-cols-6 gap-1">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="destination" className="label font-bold">
                        Destination
                      </label>
                      <input
                        type="text"
                        id="destination"
                        name="destination"
                        value={vehicleRequestData.destination_location}
                        className="input input-bordered"
                        disabled
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="pickupLocation"
                        className="label font-bold"
                      >
                        Pickup Location
                      </label>
                      <input
                        type="text"
                        id="pickupLocation"
                        name="pickupLocation"
                        className="input input-bordered"
                        value={
                          pickupLocation ||
                          (vehicleRequestData &&
                            vehicleRequestData.pickup_location)
                        }
                        onChange={(e) => setPickupLocation(e.target.value)}
                        disabled={
                          vehicleRequestData &&
                          vehicleRequestData.status !== "pending" &&
                          vehicleRequestData.status !== "approved"
                        }
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="pickupDate" className="label font-bold">
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        id="pickupDate"
                        name="pickupDate"
                        className="input input-bordered"
                        value={
                          date ||
                          (vehicleRequestData &&
                            formatDate(vehicleRequestData.pickup_date))
                        }
                        onChange={(e) => setDate(e.target.value)}
                        disabled={
                          vehicleRequestData &&
                          vehicleRequestData.status !== "pending" &&
                          vehicleRequestData.status !== "approved"
                        }
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="numPassengers"
                        className="label font-bold"
                      >
                        Number of Passengers
                      </label>
                      <input
                        type="number"
                        id="numberOfPassengers"
                        name="numberOfPassengers"
                        className="input input-bordered"
                        value={vehicleRequestData.number_of_passengers}
                        disabled
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="pickupTime" className="label font-bold">
                        Pickup Time
                      </label>
                      <input
                        type="time"
                        id="pickupTime"
                        name="pickupTime"
                        className="input input-bordered"
                        value={
                          time ||
                          (vehicleRequestData && vehicleRequestData.pickup_time)
                        }
                        onChange={(e) => setTime(e.target.value)}
                        disabled={
                          vehicleRequestData &&
                          vehicleRequestData.status !== "pending" &&
                          vehicleRequestData.status !== "approved"
                        }
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="siteName" className="label font-bold">
                        Requester
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        name="first_name"
                        value={vehicleRequestData.requester_name}
                        className="input input-bordered"
                        disabled
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="driver" className="label font-bold">
                        Assign a Driver
                      </label>
                      <select
                        id="driver"
                        as="select"
                        value={driver || ""}
                        onChange={(event) => {
                          setDriver(event.target.value);
                        }}
                        className="select select-bordered"
                        disabled={
                          vehicleRequestData &&
                          vehicleRequestData.status !== "pending" &&
                          vehicleRequestData.status !== "approved"
                        }
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
                        value={vehicle || ""}
                        onChange={(event) => setVehicle(event.target.value)}
                        className="select select-bordered"
                        disabled={
                          vehicleRequestData &&
                          vehicleRequestData.status !== "pending" &&
                          vehicleRequestData.status !== "approved"
                        }
                      >
                        <option value="">Select a Vehicle</option>
                        {vehicles.map((v) => (
                          <option key={crypto.randomUUID()} value={v.id}>
                            {v.make} {v.model} • {v.number_of_seats} seats •{" "}
                            {v.vehicle_registration}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="remarks" className="label font-bold">
                        Remarks
                      </label>
                      <textarea
                        type="text"
                        id="remarks"
                        name="remarks"
                        value={remarks || ""}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="input input-bordered w-10/12 h-24 p-2"
                        disabled={
                          vehicleRequestData &&
                          vehicleRequestData.status !== "pending" &&
                          vehicleRequestData.status !== "approved"
                        }
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="purpose" className="label font-bold">
                        Purpose
                      </label>
                      <textarea
                        type="text"
                        id="purpose"
                        name="purpose"
                        value={vehicleRequestData.purpose}
                        className="input input-bordered w-full h-24 p-2"
                        disabled
                      />
                    </div>

                    <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                      {vehicleRequestData &&
                      vehicleRequestData.status !== "completed" &&
                      vehicleRequestData.status !== "rejected" &&
                      vehicleRequestData.status !== "in_progress" ? (
                        <>
                          <button
                            className="btn btn-primary text-white"
                            onClick={approveVehicleRequest}
                          >
                            Approve
                          </button>
                          <button
                            className="mx-1 btn btn-error text-white lg:mx-0"
                            onClick={rejectVehicleRequest}
                          >
                            Reject
                          </button>
                        </>
                      ) : null}
                      <button
                        className="btn btn-outline"
                        onClick={(e) => navigate("/vehicle-requests")}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        ) : (
          <p>Loading vehicle request data...</p>
        )}
      </Sidebar>
    </>
  );
};

export default VehicleRequestDetails;
