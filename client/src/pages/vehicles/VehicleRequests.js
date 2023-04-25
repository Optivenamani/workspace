import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import formatTime from "../../utils/formatTime";
import { useNavigate } from "react-router-dom";
import huh from "../../assets/app-illustrations/Shrug-bro.png";

const VehicleRequests = () => {
  const [actionStates, setActionStates] = useState({});
  const [vehicleRequests, setVehicleRequests] = useState([]);
  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicleRequests = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/vehicle-requests/pending-vehicle-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        const pendingVehicleRequests = data.filter(
          (request) => request.status === "pending"
        );
        setVehicleRequests(pendingVehicleRequests);
      } catch (error) {
        console.error("Error fetching vehicle requests:", error);
      }
    };

    fetchVehicleRequests();

    const pendingVehicleRequests = vehicleRequests.filter(
      (request) => request.status === "pending"
    );
    setVehicleRequests(pendingVehicleRequests);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleView = (id) => {
    navigate(`/vehicle-request-details/${id}`);
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
        `http://localhost:8080/api/vehicle-requests/reject-vehicle-request/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ remarks: rejectionReason }),
        }
      );

      if (response.ok) {
        setVehicleRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== id)
        );
      } else {
        console.error(
          "Error rejecting vehicle request:",
          await response.json()
        );
      }
    } catch (error) {
      console.error("Error rejecting vehicle request:", error);
    }
  };

  return (
    <>
      <Sidebar>
        <div className="flex flex-col">
          <div className="mt-6 mb-6 flex justify-center">
            <h1 className="text-2xl font-bold text-gray-800 uppercase">
              <span className="text-primary font-bold">
                {vehicleRequests.length}
              </span>{" "}
              Vehicle Requests
            </h1>
          </div>
          {vehicleRequests.length > 0 ? (
            <div className="flex flex-col items-center justify-center px-3 mb-12">
              <div className="flex flex-col space-y-4">
                {vehicleRequests.map((vr) => {
                  const { showRejectReason } = actionStates[vr.id] || {};
                  return (
                    <div
                      key={vr.id}
                      className="bg-white shadow-lg rounded-md p-4 flex items-center justify-between w-96"
                    >
                      <div className="flex items-center p-4">
                        <div className="flex flex-col">
                          <p className="text-gray-800 font-bold w-full">
                            Vehicle Request Sent From{" "}
                            <span className="text-primary font-bold">
                              {vr.requester_name}
                            </span>
                          </p>
                          <div className="">
                            <p className="font-bold">
                              Destination:{" "}
                              <span className="text-primary font-bold">
                                {vr.destination_location}
                              </span>
                            </p>
                            <p className="font-bold">
                              Purpose:{" "}
                              <span className="text-primary font-bold">
                                {vr.purpose}
                              </span>
                            </p>
                            <p className="font-bold">
                              Number of Passengers:{" "}
                              <span className="text-primary font-bold">
                                {vr.number_of_passengers}
                              </span>
                            </p>
                            <p className="font-bold">
                              Pickup Location:{" "}
                              <span className="text-primary font-bold">
                                {vr.pickup_location}
                              </span>
                            </p>
                            <p className="font-bold">
                              Pickup Date:{" "}
                              <span className="text-primary font-bold">
                                {new Date(vr.pickup_date).toLocaleDateString(
                                  "en-GB"
                                )}
                              </span>
                            </p>
                            <p className="font-bold">
                              Pickup Time:{" "}
                              <span className="text-primary font-bold">
                                {formatTime(vr.pickup_time)}
                              </span>
                            </p>
                          </div>

                          <div className="mt-2 -ml-2">
                            <button
                              onClick={() => handleView(vr.id)}
                              className="btn btn-primary text-white ml-2"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleReject(vr.id)}
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
                                htmlFor={`rejectionReason-${vr.id}`}
                              >
                                <span className="label-text font-bold">
                                  Reason
                                </span>
                              </label>
                              <textarea
                                name={`rejectionReason-${vr.id}`}
                                id={`rejectionReason-${vr.id}`}
                                className="textarea textarea-bordered h-24 w-full border"
                              ></textarea>
                              <button
                                onClick={() => {
                                  const rejectionReason =
                                    document.getElementById(
                                      `rejectionReason-${vr.id}`
                                    ).value;
                                  handleRejectReason(vr.id, rejectionReason);
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
                  No vehicle requests available. Check back later.
                </h1>
              </div>
            </div>
          )}
        </div>
      </Sidebar>
    </>
  );
};

export default VehicleRequests;
