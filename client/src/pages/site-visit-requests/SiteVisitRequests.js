import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import formatTime from "../../utils/formatTime";
import { useNavigate } from "react-router-dom";
import huh from "../../assets/app-illustrations/Shrug-bro.png";

const SiteVisitRequests = () => {
  const [siteVisitRequests, setSiteVisitRequests] = useState([]);
  const [pending, setPending] = useState([]);
  const token = useSelector((state) => state.user.token);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSiteVisitRequests = async () => {
      try {
        const response = await fetch(
          "https://209.38.246.14:8080/api/site-visit-requests/all",
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
        setSiteVisitRequests(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchSiteVisitRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleView = (id) => {
    navigate(`/site-visit-requests/${id}`);
  };

  const getRowColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning";
      case "approved":
        return "bg-info";
      case "rejected":
        return "bg-error";
      case "complete":
        return "bg-primary";
      case "in_progress":
        return "bg-secondary";
      case "reviewed":
        return "bg-primary";
      case "cancelled":
        return "bg-gray-500";
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
              Pending Site Visit Request
              {pending.length > 1 || pending.length === 0 ? "s" : ""}
            </h1>
            <div>
              <div className="badge badge-warning text-white font-bold mr-1">
                Pending
              </div>
              <div className="badge bg-gray-500 border-none text-white font-bold mr-1">
                Cancelled
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
              <div className="badge badge-secondary text-white font-bold mr-1">
                In Progress
              </div>
            </div>
          </div>
          <div className="px-4 mt-2 flex justify-center mb-10">
            {siteVisitRequests.length > 0 ? (
              <div className="overflow-x-auto w-screen card bg-base-100 shadow-xl">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-center bg-gray-500 text-secondary-content">
                      <th className="border border-secondary-content px-2">
                        #
                      </th>
                      <th className="border border-secondary-content px-2">
                        Date
                      </th>
                      <th className="border border-secondary-content px-2">
                        Marketer
                      </th>
                      <th className="border border-secondary-content px-2">
                        Clients
                      </th>
                      <th className="border border-secondary-content px-2">
                        Site Name
                      </th>
                      <th className="border border-secondary-content px-2">
                        Driver
                      </th>
                      <th className="border border-secondary-content px-2">
                        Pickup Time
                      </th>
                      <th className="border border-secondary-content px-2">
                        Vehicle
                      </th>
                      <th className="border border-secondary-content px-2">
                        Pickup Location
                      </th>
                      <th className="border border-secondary-content px-2">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {siteVisitRequests.map((svr, index) => (
                      <tr
                        key={svr.id}
                        className={`text-secondary-content text-center hover:bg-neutral cursor-pointer ${getRowColor(
                          svr.status
                        )}`}
                        onClick={() => handleView(svr.id)}
                      >
                        <td className="border border-secondary-content px-2">
                          {index + 1}
                        </td>
                        <td className="border border-secondary-content px-2">
                          {new Date(svr.pickup_date).toLocaleDateString(
                            "en-GB"
                          )}
                        </td>
                        <td className="border border-secondary-content px-2">
                          {svr.marketer_name.toUpperCase()}
                        </td>
                        <td className="border border-secondary-content px-2">
                          {svr.num_clients}
                        </td>
                        <td className="border border-secondary-content px-2">
                          {svr.site_name}
                        </td>
                        <td className="border border-secondary-content px-2">
                          {svr.driver_name}
                        </td>
                        <td className="border border-secondary-content px-2">
                          {formatTime(svr.pickup_time)}
                        </td>
                        <td className="border border-secondary-content px-2">
                          {svr.vehicle_name}
                        </td>
                        <td className="border border-secondary-content px-2">
                          {svr.pickup_location}
                        </td>
                        <td className="border border-secondary-content px-2 max-w-sm">
                          {svr.remarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="text-center bg-gray-500 text-secondary-content">
                      <th className="border border-secondary-content px-2">
                        #
                      </th>
                      <th className="border border-secondary-content px-2">
                        Date
                      </th>
                      <th className="border border-secondary-content px-2">
                        Marketer
                      </th>
                      <th className="border border-secondary-content px-2">
                        Clients
                      </th>
                      <th className="border border-secondary-content px-2">
                        Site Name
                      </th>
                      <th className="border border-secondary-content px-2">
                        Driver
                      </th>
                      <th className="border border-secondary-content px-2">
                        Pickup Time
                      </th>
                      <th className="border border-secondary-content px-2">
                        Vehicle
                      </th>
                      <th className="border border-secondary-content px-2">
                        Pickup Location
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
                    No site visit requests available. Check back later.
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

export default SiteVisitRequests;
