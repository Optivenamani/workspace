import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import huh from "../../assets/app-illustrations/Shrug-bro.png";

const VehicleRequests = () => {
  const [vehicleRequests, setVehicleRequests] = useState([]);
  const [pending, setPending] = useState([]);
  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicleRequests = async () => {
      try {
        const response = await fetch(
          "https://209.38.246.14:8080/api/vehicle-requests/all-vehicle-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        const filtered = data.filter((item) => item.status === "pending");
        setPending(filtered);
        setVehicleRequests(data);
        console.log(filtered);
      } catch (error) {
        console.error("Error fetching vehicle requests:", error);
      }
    };

    fetchVehicleRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleView = (id) => {
    navigate(`/vehicle-request-details/${id}`);
  };

  const getRowColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning";
      case "approved":
        return "bg-info";
      case "in_progress":
        return "bg-secondary";
      case "rejected":
        return "bg-error";
      case "completed":
        return "bg-primary";
      default:
        return "";
    }
  };

  return (
    <>
      <Sidebar>
        <div className="flex flex-col">
          <div className="mt-6 mb-6 flex justify-between mx-4">
            <h1 className="text-2xl font-bold text-gray-800 uppercase">
              <span className="text-primary font-bold">{pending.length}</span>{" "}
              Pending Vehicle Request
              {pending.length > 1 || pending.length === 0 ? "s" : ""}
            </h1>
            <div>
              <div className="badge badge-warning text-white font-bold mr-1">
                Pending
              </div>

              <div className="badge badge-info text-white font-bold">
                Approved
              </div>
              <div className="badge badge-error text-white font-bold mx-1">
                Rejected
              </div>
              <div className="badge badge-primary text-white font-bold mr-1">
                Completed
              </div>
              <div className="badge badge-secondary text-white font-bold">
                In Progress
              </div>
            </div>
          </div>
          <div className="px-4 mt-2 flex justify-center mb-10">
            {vehicleRequests.length > 0 ? (
              <div className="overflow-x-auto w-screen card bg-base-100 shadow-xl">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-center bg-gray-500 text-secondary-content">
                      <th className="border border-secondary-content px-2">
                        #
                      </th>
                      <th className="border border-secondary-content px-2">
                        Requester
                      </th>
                      <th className="border border-secondary-content px-2">
                        Purpose
                      </th>
                      <th className="border border-secondary-content px-2">
                        Passengers
                      </th>
                      <th className="border border-secondary-content px-2">
                        Pickup Location
                      </th>
                      <th className="border border-secondary-content px-2">
                        Destination
                      </th>
                      <th className="border border-secondary-content px-2">
                        Pickup Date
                      </th>
                      <th className="border border-secondary-content px-2">
                        Pickup Time
                      </th>
                      <th className="border border-secondary-content px-2">
                        Vehicle
                      </th>
                      <th className="border border-secondary-content px-2">
                        Driver
                      </th>
                      <th className="border border-secondary-content px-2">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleRequests
                      .sort((a, b) => b.id - a.id)
                      .map((vr, index) => (
                        <tr
                          key={vr.id}
                          className={`text-secondary-content text-center hover:bg-neutral cursor-pointer ${getRowColor(
                            vr.status
                          )}`}
                          onClick={() => handleView(vr.id)}
                        >
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">
                            {vr.requester_name}
                          </td>
                          <td className="border px-4 py-2">{vr.purpose}</td>
                          <td className="border px-4 py-2">
                            {vr.number_of_passengers}
                          </td>
                          <td className="border px-4 py-2">
                            {vr.pickup_location}
                          </td>
                          <td className="border px-4 py-2">
                            {vr.destination_location}
                          </td>
                          <td className="border px-4 py-2">
                            {new Date(vr.pickup_date).toLocaleDateString(
                              "en-GB"
                            )}
                          </td>
                          <td className="border px-4 py-2">
                            {vr.pickup_time}
                          </td>
                          <td className="border px-4 py-2">
                            {vr.vehicle_registration}
                          </td>
                          <td className="border px-4 py-2">{vr.driver_name}</td>
                          <td className="border px-4 py-2">{vr.remarks}</td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr className="text-center bg-gray-500 text-secondary-content">
                      <th className="border border-secondary-content px-2">
                        #
                      </th>
                      <th className="border border-secondary-content px-2">
                        Requester
                      </th>
                      <th className="border border-secondary-content px-2">
                        Purpose
                      </th>
                      <th className="border border-secondary-content px-2">
                        Passengers
                      </th>
                      <th className="border border-secondary-content px-2">
                        Pickup Location
                      </th>
                      <th className="border border-secondary-content px-2">
                        Destination
                      </th>
                      <th className="border border-secondary-content px-2">
                        Pickup Date
                      </th>
                      <th className="border border-secondary-content px-2">
                        Pickup Time
                      </th>
                      <th className="border border-secondary-content px-2">
                        Vehicle
                      </th>
                      <th className="border border-secondary-content px-2">
                        Driver
                      </th>
                      <th className="border border-secondary-content px-2">
                        Remarks
                      </th>
                    </tr>
                  </tfoot>
                </table>
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
        </div>
      </Sidebar>
    </>
  );
};

export default VehicleRequests;
