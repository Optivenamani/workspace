import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import vehicleSide from "../../../assets/media/vehicle-side.jpg";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SiteVisitDetails = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [remarks, setRemarks] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [driver, setDriver] = useState("");
  const [site, setSite] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [numClients, setNumClients] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("pending");
  const [marketerName, setMarketerName] = useState("");
  const [sites, setSites] = useState([]);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const { id } = useParams();

  // fetch the current site visit request
  useEffect(() => {
    const fetchSiteVisitRequest = async (id) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://workspace.optiven.co.ke/api/site-visit-requests/pending-site-visits/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("Site Visit Request details: ", data);
        setSite(data.project_id);
        setPickupLocation(data.pickup_location);
        setPickupDate(data.pickup_date);
        setNumClients(data.num_clients);
        setPickupTime(data.pickup_time);
        setMarketerName(data.marketer_name);
        setRemarks(data.remarks);
        setDriver(data.driver_id);
        setVehicle(data.vehicle_id);
        setStatus(data.status);
      } catch (error) {
        console.error("Error fetching site visit request:", error);
      }
    };

    fetchSiteVisitRequest(id);
  }, [id, token]);

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
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, [token]);

  // fetch sites
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch("https://workspace.optiven.co.ke/api/sites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Sites: ", data);
        setSites(data);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };

    fetchSites();
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
        setDrivers(data.map((driver) => ({ ...driver, id: driver.driver_id })));
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, [token]);

  // approve/edit site visit
  const approveSiteVisit = async () => {
    try {
      const requestBody = {
        ...(vehicle !== null && { vehicle_id: parseInt(vehicle) }),
        ...(pickupLocation !== null && { pickup_location: pickupLocation }),
        ...(pickupDate !== null && { pickup_date: formatDate(pickupDate) }),
        ...(pickupTime !== null && { pickup_time: pickupTime }),
        ...(remarks !== null && { remarks: remarks }),
        ...(driver !== null && { driver_id: driver }),
        ...(site !== null && { project_id: parseInt(site) }),
        status: "approved",
      };

      console.log("Request body:", requestBody);
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/site-visit-requests/pending-site-visits/${id}`,
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
        `https://workspace.optiven.co.ke/api/site-visit-requests/reject-site-visit/${id}`,
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
        toast.error("Site visit rejected.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
        {loading && (
          <div>
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
              <div className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                <img
                  alt="Night"
                  src={vehicleSide}
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
              </div>
              <main
                aria-label="Main"
                className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
              >
                <div className="max-w-xl lg:max-w-3xl">
                  <div action="#" className="grid grid-cols-6 gap-1">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="siteName" className="label font-bold">
                        Site
                      </label>
                      <select
                        id="site"
                        as="select"
                        value={site}
                        onChange={(event) => {
                          setSite(event.target.value);
                        }}
                        className="select select-bordered lg:w-4/5"
                        required
                      >
                        <option value="">Pick a site</option>
                        {sites.map((site) => (
                          <option
                            key={crypto.randomUUID()}
                            value={site.project_id}
                          >
                            {site.name}
                          </option>
                        ))}
                      </select>
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
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        disabled={
                          (status !== "pending" && status !== "approved") ||
                          pickupLocation.toLowerCase() === "self drive"
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
                        value={formatDate(pickupDate)}
                        onChange={(e) => setPickupDate(e.target.value)}
                        disabled={status !== "pending" && status !== "approved"}
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
                        value={numClients}
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
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        disabled={status !== "pending" && status !== "approved"}
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
                        value={marketerName}
                        className="input input-bordered"
                        disabled
                      />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="driver" className="label font-bold">
                        Assign a Driver
                      </label>
                      <select
                        required
                        id="driver"
                        as="select"
                        value={driver}
                        onChange={(event) => {
                          setDriver(event.target.value);
                        }}
                        className="select select-bordered"
                        disabled={status !== "pending" && status !== "approved"}
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
                        required
                        id="vehicle"
                        as="select"
                        value={vehicle}
                        onChange={(event) => setVehicle(event.target.value)}
                        className="select select-bordered"
                        disabled={status !== "pending" && status !== "approved"}
                      >
                        <option value="">Select a Vehicle</option>
                        {vehicles.map((v) => (
                          <option key={crypto.randomUUID()} value={v.id}>
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
                        required
                        id="remarks"
                        name="remarks"
                        className="input input-bordered h-24 w-full p-2"
                        value={remarks || ""}
                        onChange={(e) => setRemarks(e.target.value)}
                        disabled={status !== "pending" && status !== "approved"}
                      />
                    </div>
                    <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                      {status !== "reviewed" &&
                      status !== "complete" &&
                      status !== "rejected" &&
                      status !== "in_progress" ? (
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
        )}
      </Sidebar>
    </>
  );
};

export default SiteVisitDetails;
