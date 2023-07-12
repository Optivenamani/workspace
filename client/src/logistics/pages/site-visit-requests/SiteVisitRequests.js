import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import formatTime from "../../../utils/formatTime";
import { useNavigate } from "react-router-dom";
import huh from "../../../assets/app-illustrations/Shrug-bro.png";

const SiteVisitRequests = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [siteVisitRequests, setSiteVisitRequests] = useState([]);
  const [pending, setPending] = useState([]);
  const token = useSelector((state) => state.user.token);

  // Calculate the range of items to be displayed on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = siteVisitRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(siteVisitRequests.length / itemsPerPage);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSiteVisitRequests = async () => {
      try {
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/site-visit-requests/",
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

        // Sort the data by date in descending order
        const sortedData = data.sort((a, b) => {
          return new Date(b.pickup_date) - new Date(a.pickup_date);
        });

        const filtered = sortedData.filter((item) => {
          if (selectedStatus === "all") {
            return true;
          } else if (
            selectedStatus === "in_progress" ||
            selectedStatus === "complete"
          ) {
            return item.status === "in_progress" || item.status === "complete";
          } else {
            return item.status === selectedStatus;
          }
        });

        setPending(filtered);
        setSiteVisitRequests(filtered);
        console.log(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchSiteVisitRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedStatus]);

  const handleView = (id) => {
    navigate(`/site-visit-requests/${id}`);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
        return "bg-purple-500";
      case "in_progress":
        return "bg-purple-500";
      case "reviewed":
        return "bg-primary";
      case "cancelled":
        return "bg-gray-500";
      default:
        return "";
    }
  };

  const renderPaginationButtons = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return (
      <div className="join">
        <button
          className="join-item btn btn-sm mr-1 w-10 lg:w-20"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          «
        </button>
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <button key={index} className="join-item btn btn-sm btn-disabled">
                {pageNumber}
              </button>
            );
          }
          return (
            <button
              key={index}
              onClick={() => handlePageChange(pageNumber)}
              className={`join-item btn btn-sm ${
                pageNumber === currentPage
                  ? "btn-active btn-success"
                  : "btn-success"
              }`}
              disabled={pageNumber === currentPage}
            >
              {pageNumber}
            </button>
          );
        })}
        <button
          className="join-item btn btn-sm ml-1 w-10 lg:w-20"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    );
  };

  let statusText = "";
  switch (selectedStatus) {
    case "all":
      statusText = "Total Site Visit Requests";
      break;
    case "pending":
      statusText = "Pending Site Visit Requests";
      break;
    case "cancelled":
      statusText = "Cancelled Site Visit Requests";
      break;
    case "approved":
      statusText = "Approved Site Visit Requests";
      break;
    case "rejected":
      statusText = "Rejected Site Visit Requests";
      break;
    case "complete":
      statusText = "Complete Site Visits";
      break;
    case "in_progress":
      statusText = "Site Visits In Progress";
      break;
    default:
      statusText = "Site Visit Requests";
      break;
  }

  return (
    <>
      <Sidebar>
        <div className="flex flex-col">
          <div className="mt-6 mb-6 flex flex-col mx-4">
            <h1 className="text-3xl font-extrabold mb-1 text-gray-800 uppercase text-center">
              <span className="text-primary">{pending.length}</span>{" "}
              {statusText}
            </h1>
            <div className="grid grid-cols-3 lg:grid-cols-7 justify-center">
              <div
                className={`btn m-1 btn-outline font-bold mr-1 ${
                  selectedStatus === "all" ? "btn-active" : ""
                }`}
                onClick={() => setSelectedStatus("all")}
              >
                All
              </div>
              <div
                className={`btn m-1 btn-warning text-white font-bold mr-1 ${
                  selectedStatus === "pending" ? "btn-active" : ""
                }`}
                onClick={() => setSelectedStatus("pending")}
              >
                Pending
              </div>
              <div
                className={`btn m-1 bg-gray-500 text-white font-bold mr-1 border-none ${
                  selectedStatus === "cancelled" ? "btn-active" : ""
                }`}
                onClick={() => setSelectedStatus("cancelled")}
              >
                Cancelled
              </div>
              <div
                className={`btn m-1 btn-info text-white font-bold ${
                  selectedStatus === "approved" ? "btn-active" : ""
                }`}
                onClick={() => setSelectedStatus("approved")}
              >
                Approved
              </div>
              <div
                className={`btn m-1 btn-error text-white font-bold mx-1 ${
                  selectedStatus === "rejected" ? "btn-active" : ""
                }`}
                onClick={() => setSelectedStatus("rejected")}
              >
                Rejected
              </div>
              <div
                className={`btn m-1 btn-primary text-white font-bold mr-1 ${
                  selectedStatus === "reviewed" ? "btn-active" : ""
                }`}
                onClick={() => setSelectedStatus("reviewed")}
              >
                Complete
              </div>
              <div
                className={`btn m-1 bg-purple-500 border-none text-white font-bold ${
                  selectedStatus === "in_progress" ||
                  selectedStatus === "complete"
                    ? "btn-active"
                    : ""
                }`}
                onClick={() => setSelectedStatus("in_progress" || "complete")}
              >
                In Progress
              </div>
            </div>
          </div>
          <div className="px-4 mt-2 flex justify-center mb-5">
            {siteVisitRequests.length > 0 ? (
              <div className="overflow-x-auto w-screen card bg-base-100 shadow-xl">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-center bg-gray-700 text-secondary-content">
                      <th className="border border-secondary-content px-2 py-2">
                        #
                      </th>
                      <th className="border border-secondary-content px-2 py-2">
                        Date
                      </th>
                      <th className="border border-secondary-content px-2 py-2">
                        Marketer
                      </th>
                      <th className="border border-secondary-content px-2 py-2">
                        Clients
                      </th>
                      <th className="border border-secondary-content px-2 py-2">
                        Site Name
                      </th>
                      <th className="border border-secondary-content px-2 py-2">
                        Driver
                      </th>
                      <th className="border border-secondary-content px-2 py-2">
                        Pickup Time
                      </th>
                      <th className="border border-secondary-content px-2 py-2">
                        Vehicle
                      </th>
                      <th className="border border-secondary-content px-2 py-2">
                        Pickup Location
                      </th>
                      <th className="border border-secondary-content px-2 py-2">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((svr, index) => (
                      <tr
                        key={svr.id}
                        className={`text-secondary-content text-center hover:bg-neutral cursor-pointer ${getRowColor(
                          svr.status
                        )}`}
                        onClick={() => handleView(svr.id)}
                      >
                        <td className="border border-secondary-content px-2 py-2 font-bold">
                          {index + 1}
                        </td>
                        <td className="border border-secondary-content px-2 py-2 font-bold">
                          {new Date(svr.pickup_date).toLocaleDateString(
                            "en-GB"
                          )}
                        </td>
                        <td className="border border-secondary-content px-2 py-2 font-bold">
                          {svr.marketer_name.toUpperCase()}
                        </td>
                        <td className="border border-secondary-content px-2 py-2 font-bold">
                          {svr.num_clients}
                        </td>
                        <td className="border border-secondary-content px-2 py-2 font-bold">
                          {svr.site_name}
                        </td>
                        <td className="border border-secondary-content px-2 py-2 font-bold">
                          {svr.driver_name}
                        </td>
                        <td className="border border-secondary-content px-2 py-2 font-bold">
                          {formatTime(svr.pickup_time)}
                        </td>
                        <td className="border border-secondary-content px-2 py-2 font-bold">
                          {svr.vehicle_name}
                        </td>
                        <td className="border border-secondary-content px-2 py-2 font-bold">
                          {svr.pickup_location}
                        </td>
                        <td className="border border-secondary-content px-2 py-2 font-bold max-w-sm">
                          {svr.remarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="text-center bg-gray-700 text-secondary-content">
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
          <div className="flex justify-center mb-10">
            <div className="join">{renderPaginationButtons()}</div>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="select select-bordered select-sm mx-2">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default SiteVisitRequests;
