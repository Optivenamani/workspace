import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar";
import formatTime from "../../../utils/formatTime";

const MySiteVisits = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [siteVisits, setSiteVisits] = useState([]);
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user.user_id);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSiteVisits = async () => {
      try {
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/site-visit-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setSiteVisits(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchSiteVisits();
  }, [token]);

  const cancelSiteVisit = async (siteVisitId) => {
    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/site-visit-requests/cancel-site-visit/${siteVisitId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSiteVisits(
          siteVisits.map((siteVisit) =>
            siteVisit.id === siteVisitId
              ? { ...siteVisit, status: "cancelled" }
              : siteVisit
          )
        );
        toast.success(data.message, {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(data.message || "Error cancelling site visit.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error cancelling site visit:", error);
      toast.error(error.message || "Error cancelling site visit.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const userSiteVisits = siteVisits.filter(
    (siteVisit) => siteVisit.marketer_id === userId
  );

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const filteredSiteVisits = userSiteVisits.filter((item) => {
    const itemDate = new Date(item.pickup_date);
    const startDateObj = startDate && new Date(startDate);
    const endDateObj = endDate && new Date(endDate);

    if (startDateObj && endDateObj) {
      return itemDate >= startDateObj && itemDate <= endDateObj;
    } else if (startDate) {
      return itemDate >= startDateObj;
    } else if (endDateObj) {
      return itemDate <= endDateObj;
    } else {
      return true;
    }
  });

  const startTrip = async (id) => {
    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/site-visits/start-trip/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedSiteVisits = siteVisits.map((sv) =>
          sv.id === id ? { ...sv, status: "in_progress" } : sv
        );
        setSiteVisits(updatedSiteVisits);
        toast.success("Trip set to in progress.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const data = await response.json();
        toast.error("An error occurred while attempting to start trip.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error starting trip:", data.message);
      }
    } catch (error) {
      toast.error("An error occurred while attempting to start trip.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error starting trip:", error);
    }
  };

  const endTrip = async (id) => {
    try {
      const response = await fetch(
        `https://workspace.optiven.co.ke/api/site-visits/end-trip/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedSiteVisits = siteVisits.filter((sv) => sv.id !== id);
        setSiteVisits(updatedSiteVisits);
        toast.success("Trip set to complete.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        const data = await response.json();
        toast.error("An error occurred while attempting to end trip.", {
          position: "top-center",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.error("Error ending trip:", data.message);
      }
    } catch (error) {
      toast.error("An error occurred while attempting to end trip.", {
        position: "top-center",
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Error ending trip:", error);
    }
  };

  return (
    <Sidebar>
      <div className="container px-4 pb-6 mx-auto">
        <div className="flex justify-center items-center my-4">
          <div className="flex space-x-2 items-center">
            <input
              type="date"
              className="input input-bordered max-w-xs mt-2"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <span className="text-lg font-bold">to</span>
            <input
              type="date"
              className="input input-bordered max-w-xs mt-2"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
        <div className="overflow-x-auto card bg-base-100 shadow-xl">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Index</th>
                <th>Site Name</th>
                <th>Clients</th>
                <th>Pickup Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSiteVisits
                .sort((a, b) => b.id - a.id)
                .map((siteVisit, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{siteVisit.site_name}</td>
                    <td>{siteVisit.num_clients}</td>
                    <td>{siteVisit.pickup_location}</td>
                    <td>
                      {new Date(siteVisit.pickup_date).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td>{formatTime(siteVisit.pickup_time)}</td>
                    <td
                      style={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        color:
                          siteVisit.status === "rejected"
                            ? "red"
                            : siteVisit.status === "complete"
                            ? "purple"
                            : siteVisit.status === "reviewed"
                            ? "green"
                            : "black",
                      }}
                    >
                      {siteVisit.status === "in_progress"
                        ? "In Progress"
                        : siteVisit.status === "complete"
                        ? "Pending Survey"
                        : siteVisit.status === "reviewed"
                        ? "Complete"
                        : siteVisit.status}
                    </td>

                    <td>
                      {siteVisit.status === "pending" ? (
                        <button
                          className="btn btn-sm btn-outline btn-warning mr-2"
                          onClick={() =>
                            navigate(`/edit-site-visit/${siteVisit.id}`)
                          }
                        >
                          Edit
                        </button>
                      ) : null}
                      {siteVisit.status === "pending" ||
                      siteVisit.status === "approved" ? (
                        <button
                          className="btn btn-sm btn-gray-500 mr-1"
                          onClick={() => cancelSiteVisit(siteVisit.id)}
                        >
                          Cancel
                        </button>
                      ) : null}
                      {siteVisit.pickup_location.toLowerCase() ===
                        "self drive" &&
                      (siteVisit.status === "approved" ||
                        siteVisit.status === "in_progress") &&
                      siteVisit.driver_name === "Own Means" &&
                      siteVisit.vehicle_id === 23 ? (
                        <button
                          className={`btn btn-sm ${
                            siteVisit.status === "in_progress"
                              ? "btn-error"
                              : "btn-primary"
                          } text-white`}
                          onClick={() =>
                            siteVisit.status === "in_progress"
                              ? endTrip(siteVisit.id)
                              : startTrip(siteVisit.id)
                          }
                        >
                          {siteVisit.status === "in_progress"
                            ? "End Trip"
                            : "Start Trip"}
                        </button>
                      ) : null}
                      {siteVisit.status === "complete" ? (
                        <button
                          className="btn btn-sm btn-gray-500 mr-1"
                          onClick={() => navigate(`/survey/${siteVisit.id}`)}
                        >
                          Complete Survey
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
};

export default MySiteVisits;
