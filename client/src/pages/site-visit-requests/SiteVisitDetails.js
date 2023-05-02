import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SiteVisitDetails = () => {
  const [siteVisitData, setSiteVisitData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState("");
  const [, setIsApproved] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [driver, setDriver] = useState("");
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const { id } = useParams();

  // fetch the current site visit request
  useEffect(() => {
    const fetchSiteVisitRequest = async (id) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/site-visit-requests/pending-site-visits/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Site Visit Request details: ", data);
        setSiteVisitData(data);
        setIsApproved(data.status === "approved");
      } catch (error) {
        console.error("Error fetching site visit request:", error);
      }
    };

    fetchSiteVisitRequest(id);
  }, [id, token]);

  // fetch *available vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/vehicles/available",
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

  // fetch *available drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/drivers/all-drivers",
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

  // fetch site visit data
  useEffect(() => {
    if (siteVisitData) {
      setVehicle(siteVisitData.vehicle_id);
      setPickupLocation(siteVisitData.pickup_location);
      setDate(formatDate(siteVisitData.pickup_date));
      setTime(siteVisitData.pickup_time);
      setRemarks(siteVisitData.remarks);
      setDriver(siteVisitData.driver_id);
    }
  }, [siteVisitData]);

  // approve/edit site visit
  const approveSiteVisit = async () => {
    try {
      const requestBody = {
        ...(vehicle !== null && { vehicle_id: parseInt(vehicle) }),
        ...(pickupLocation !== null && { pickup_location: pickupLocation }),
        ...(date !== null && { pickup_date: date }),
        ...(time !== null && { pickup_time: time }),
        ...(remarks !== null && { remarks: remarks }),
        ...(driver !== null && { driver_id: driver }),
        status: "approved",
      };

      console.log("Driver", driver);

      console.log("Request object: ", requestBody);

      const response = await fetch(
        `http://localhost:8080/api/site-visit-requests/pending-site-visits/${id}`,
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
        toast.success("Site visit updated successfully.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/site-visit-requests");
      } else {
        console.error("Error updating site visit:", data.message);
        toast.error("An error occurred while updating the site visit.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error("An error occurred while updating the site visit.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error updating site visit:", error);
    }
  };

  // reject site visit
  const rejectSiteVisit = async () => {
    try {
      const requestBody = {
        ...(remarks !== null && { remarks: remarks }),
      };

      const response = await fetch(
        `http://localhost:8080/api/site-visit-requests/reject-site-visit/${id}`,
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
        alert("Site visit rejected.");
        navigate("/site-visit-requests");
      } else {
        console.error("Error rejecting site visit:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error rejecting site visit:", error);
    }
  };

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
        {siteVisitData ? (
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
                      <label htmlFor="siteName" className="label font-bold">
                        Site
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        name="first_name"
                        value={siteVisitData.site_name}
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
                        name="last_name"
                        className="input input-bordered"
                        value={
                          pickupLocation ||
                          (siteVisitData && siteVisitData.pickup_location)
                        }
                        onChange={(e) => setPickupLocation(e.target.value)}
                        disabled={
                          siteVisitData &&
                          siteVisitData.status !== "pending" &&
                          siteVisitData.status !== "approved"
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
                        name="email"
                        className="input input-bordered"
                        value={
                          date ||
                          (siteVisitData &&
                            formatDate(siteVisitData.pickup_date))
                        }
                        onChange={(e) => setDate(e.target.value)}
                        disabled={
                          siteVisitData &&
                          siteVisitData.status !== "pending" &&
                          siteVisitData.status !== "approved"
                        }
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="Password" className="label font-bold">
                        Number of Clients
                      </label>
                      <input
                        type="number"
                        id="numberOfClients"
                        name="numberOfClients"
                        className="input input-bordered"
                        value={siteVisitData.num_clients}
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
                          time || (siteVisitData && siteVisitData.pickup_time)
                        }
                        onChange={(e) => setTime(e.target.value)}
                        disabled={
                          siteVisitData &&
                          siteVisitData.status !== "pending" &&
                          siteVisitData.status !== "approved"
                        }
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="siteName" className="label font-bold">
                        Marketer
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        name="first_name"
                        value={siteVisitData.marketer_name}
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
                        value={driver}
                        onChange={(event) => {
                          setDriver(event.target.value);
                        }}
                        className="select select-bordered"
                        disabled={
                          siteVisitData &&
                          siteVisitData.status !== "pending" &&
                          siteVisitData.status !== "approved"
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
                        value={vehicle}
                        onChange={(event) => setVehicle(event.target.value)}
                        className="select select-bordered"
                        disabled={
                          siteVisitData &&
                          siteVisitData.status !== "pending" &&
                          siteVisitData.status !== "approved"
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

                    <div className="col-span-6">
                      <label htmlFor="remarks" className="label font-bold">
                        Remarks
                      </label>
                      <textarea
                        id="remarks"
                        name="remarks"
                        className="input input-bordered h-24 w-full p-2"
                        value={remarks || ""}
                        onChange={(e) => setRemarks(e.target.value)}
                        disabled={
                          siteVisitData &&
                          siteVisitData.status !== "pending" &&
                          siteVisitData.status !== "approved"
                        }
                      />
                    </div>

                    <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                      {siteVisitData &&
                      siteVisitData.status !== "complete" &&
                      siteVisitData.status !== "rejected" &&
                      siteVisitData.status !== "in_progress" ? (
                        <>
                          <button
                            className="btn btn-primary text-white"
                            onClick={approveSiteVisit}
                          >
                            Approve
                          </button>
                          <button
                            className="mx-1 btn btn-error text-white lg:mx-0"
                            onClick={rejectSiteVisit}
                          >
                            Reject
                          </button>
                        </>
                      ) : null}
                      <button
                        className="btn btn-outline"
                        onClick={(e) => navigate("/site-visit-requests")}
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
          <p>Loading site visit data...</p>
        )}
      </Sidebar>
    </>
  );
};

export default SiteVisitDetails;
