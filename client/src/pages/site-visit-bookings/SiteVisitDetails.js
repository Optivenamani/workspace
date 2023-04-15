import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import format12HourTime from "../../utils/formatTime";

const SiteVisitDetails = () => {
  const [siteVisitData, setSiteVisitData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const { id } = useParams();

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
        console.log("site visit request: ", data);
        setSiteVisitData(data);
        setIsApproved(data.status === "approved");
      } catch (error) {
        console.error("Error fetching site visit request:", error);
      }
    };

    fetchSiteVisitRequest(id);
  }, [id, token]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/vehicles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("vehicles: ", data);
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, [token]);

  const approveSiteVisit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/site-visit-requests/approve-site-visit/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setIsApproved(true);
      } else {
        console.error("Error approving site visit:", data.message);
      }
    } catch (error) {
      console.error("Error approving site visit:", error);
    }
  };

  const assignVehicleToSiteVisit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/site-visit-requests/assign-vehicle/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ vehicle_id: vehicle }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Vehicle assigned to site visit successfully.");
        navigate("/site-visit-requests");
      } else {
        console.error("Error assigning vehicle to site visit:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error assigning vehicle to site visit:", error);
    }
  };

  return (
    <>
      <Sidebar>
        <div>
          {siteVisitData ? (
            <>
              <h1>Site Name: {siteVisitData.site_name}</h1>
              <h2>Pickup Location: {siteVisitData.pickup_location}</h2>
              <h3>Pickup Date: {new Date(siteVisitData.pickup_date).toLocaleDateString(
                        "en-GB"
                      )}</h3>
              <h3>Pickup Time: {format12HourTime(siteVisitData.pickup_time)}</h3>
              <h4>Number of Clients: {siteVisitData.num_clients}</h4>
              <button className="btn btn-outline" onClick={approveSiteVisit}>
                Accept Site Visit Request
              </button>
              <label>Assign vehicle:</label>
              <select
                id="vehicle"
                as="select"
                value={vehicle}
                onChange={(event) => setVehicle(event.target.value)}
                className="select select-bordered"
                disabled={!isApproved}
              >
                <option value="">Select a Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.make} {v.model} - {v.number_of_seats} seats -{" "}
                    {v.vehicle_registration}
                  </option>
                ))}
              </select>
              {isApproved && (
                <button
                  className="btn btn-outline"
                  onClick={assignVehicleToSiteVisit}
                >
                  Assign Vehicle
                </button>
              )}
            </>
          ) : (
            <p>Loading site visit data...</p>
          )}
        </div>
      </Sidebar>
    </>
  );
};

export default SiteVisitDetails;
