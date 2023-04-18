import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import format12HourTime from "../../utils/formatTime";
import { useNavigate } from "react-router-dom";
import huh from "../../assets/app-illustrations/Shrug-bro.png";

const SiteVisitRequests = () => {
  const [actionStates, setActionStates] = useState({});
  const [siteVisitRequests, setSiteVisitRequests] = useState([]);
  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSiteVisitRequests = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/site-visit-requests/pending-site-visits",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const pendingSiteVisitRequests = data.filter(
          (item) => item.status === "pending"
        );
        setSiteVisitRequests(pendingSiteVisitRequests);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchSiteVisitRequests();

    const pendingSiteVisitRequests = siteVisitRequests.filter(
      (item) => item.status === "pending"
    );
    setSiteVisitRequests(pendingSiteVisitRequests);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleView = (id) => {
    navigate(`/site-visit-requests/${id}`);
  };

  const handleReject = (id) => {
    setActionStates((prevStates) => ({
      ...prevStates,
      [id]: { showVehicleMenu: false, showRejectReason: true },
    }));
  };

  const handleRejectReason = async (id, rejectionReason) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/site-visit-requests/reject-site-visit/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rejection_reason: rejectionReason }),
        }
      );

      if (response.ok) {
        setSiteVisitRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== id)
        );
      } else {
        console.error(
          "Error rejecting site visit request:",
          await response.json()
        );
      }
    } catch (error) {
      console.error("Error rejecting site visit request:", error);
    }
  };

  return (
    <>
      <Sidebar>
        <div className="flex flex-col">
          <div className="mt-6 mb-6 flex justify-center">
            <h1 className="text-2xl font-bold text-gray-800 uppercase">
              <span className="text-primary font-bold">
                {siteVisitRequests.length}
              </span>{" "}
              Site Visit Requests
            </h1>
          </div>
          {siteVisitRequests.length > 0 ? (
            <div className="flex flex-col items-center justify-center px-3 mb-12">
              <div className="flex flex-col space-y-4">
                {siteVisitRequests.map((svr) => {
                  const { showRejectReason } = actionStates[svr.id] || {};
                  return (
                    <div
                      key={svr.id}
                      className="bg-white shadow-lg rounded-md p-4 flex items-center justify-between w-96"
                    >
                      <div className="flex items-center p-4">
                        <div className="flex flex-col">
                          <p className="text-gray-800 font-bold w-full">
                            Site Visit Booking Request Sent From{" "}
                            <span className="text-primary font-bold">
                              {svr.marketer_name}
                            </span>
                          </p>
                          <div className="">
                            <p className="font-bold">
                              Site:{" "}
                              <span className="text-primary font-bold">
                                {svr.site_name}
                              </span>
                            </p>
                            <p className="font-bold">
                              Number of Clients:{" "}
                              <span className="text-primary font-bold">
                                {svr.num_clients}
                              </span>
                            </p>
                            <p className="font-bold">
                              Pickup Location:{" "}
                              <span className="text-primary font-bold">
                                {svr.pickup_location}
                              </span>
                            </p>
                            <p className="font-bold">
                              Pickup Date:{" "}
                              <span className="text-primary font-bold">
                                {new Date(svr.pickup_date).toLocaleDateString(
                                  "en-GB"
                                )}
                              </span>
                            </p>
                            <p className="font-bold">
                              Pickup Time:{" "}
                              <span className="text-primary font-bold">
                                {format12HourTime(svr.pickup_time)}
                              </span>
                            </p>
                          </div>

                          <div className="mt-2 -ml-2">
                            <button
                              onClick={() => handleView(svr.id)}
                              className="btn btn-primary text-white ml-2"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleReject(svr.id)}
                              className={
                                showRejectReason
                                  ? `btn btn-disabled ml-2`
                                  : `btn btn-outline btn-error text-white ml-2`
                              }
                            >
                              Reject
                            </button>
                          </div>
                          {showRejectReason && (
                            <div className="mt-2">
                              <label
                                className="label"
                                htmlFor={`rejectionReason-${svr.id}`}
                              >
                                <span className="label-text font-bold">
                                  Reason
                                </span>
                              </label>
                              <textarea
                                name={`rejectionReason-${svr.id}`}
                                id={`rejectionReason-${svr.id}`}
                                className="textarea textarea-bordered h-24 w-full border"
                              ></textarea>
                              <button
                                onClick={() => {
                                  const rejectionReason =
                                    document.getElementById(
                                      `rejectionReason-${svr.id}`
                                    ).value;
                                  handleRejectReason(svr.id, rejectionReason);
                                }}
                                className="btn btn-error text-white"
                              >
                                Reject and Send Reason
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex flex-col items-center mt-20">
                <img src={huh} alt="huh" className="lg:w-96" />
                <h1 className="font-bold text-center">
                  No site visit requests available. Check back later.
                </h1>
              </div>
            </div>
          )}
        </div>
      </Sidebar>
    </>
  );
};

export default SiteVisitRequests;
