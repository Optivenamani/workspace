import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import formatTime from "../../../utils/formatTime";
import { Link } from "react-router-dom";

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

const ViewVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const office = user.office;
  const accessRole = user.Accessrole;
  
  useEffect(() => {
    // Fetch visitor data from the server
    const fetchVisitors = async () => {
      try {
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/visitors",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
       

        // If the user has "Head of Customer Experience" access role, show all visitors
        if (accessRole.split("#").includes("headOfCustomerExp")) {
          setVisitors(data);
        } else {
             // Filter visitors based on the user's office
        const filteredVisitors = data.filter((visitor) => {
          // Include visitors that match the user's office or visitors with no specified office
          return visitor.office === office || !visitor.office;
        });
          setVisitors(filteredVisitors);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchVisitors();
  }, [token, office, accessRole]);

  const handleCheckOut = async (visitorId) => {
    try {
      const currentTime = new Date();
      const hours = currentTime.getHours().toString().padStart(2, "0");
      const minutes = currentTime.getMinutes().toString().padStart(2, "0");
      const seconds = currentTime.getSeconds().toString().padStart(2, "0");
      const currentTimeString = `${hours}:${minutes}:${seconds}`;

      const response = await fetch(
        `https://workspace.optiven.co.ke/api/visitors/checkout/${visitorId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ check_out_time: currentTimeString }),
        }
      );

      if (response.ok) {
        // Update the visitor's check-out time in the state
        setVisitors((prevVisitors) =>
          prevVisitors.map((visitor) =>
            visitor.id === visitorId
              ? { ...visitor, check_out_time: currentTimeString }
              : visitor
          )
        );
      } else {
        console.error("Failed to check out visitor.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteVisitor = (visitorId) => {
    // Send a DELETE request to the server to delete the vehicle with the specified ID
    fetch(`https://workspace.optiven.co.ke/api/visitors/${visitorId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Remove the vehicle from the visitors state
        setVisitors((prevVisitors) =>
          prevVisitors.filter((visitor) => visitor.id !== visitorId)
        );
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
  const paginationArray = Array.from({ length: totalPages }, (_, index) => index + 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <Sidebar>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex justify-center mb-4">
          <input
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2 mr-2 w-72"
            placeholder="Search visitor by name"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="btn btn-primary">Search</button>
        </div>
        <div className="overflow-x-auto card bg-base-100 shadow-xl">
          <table className="table table-compact">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Staff Name</th>
                <th>Visitor Room</th>
                <th>Vehicle Registration</th>
                <th>Purpose</th>
                <th>Department</th>
                <th>Date</th>
                <th>Check-in Time</th>
                <th>Check-out Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.slice(startIndex, endIndex).map((visitor, i) => (
                <tr key={visitor.id}>
                  <td>{i + 1}</td>
                  <td>{visitor.name}</td>
                  <td>{visitor.phone}</td>
                  <td>{visitor.email}</td>
                  <td>{visitor.staff_name}</td>
                  <td>{visitor.visitor_room}</td>
                  <td>{visitor.vehicle_registration}</td>
                  <td>{visitor.purpose}</td>
                  <td>{visitor.department}</td>
                  <td>{formatDate(visitor.check_in_date)}</td>
                  <td className="text-center">
                    {formatTime(visitor.check_in_time)}
                  </td>
                  <td>
                    {visitor.check_out_time ? (
                      formatTime(visitor.check_out_time)
                    ) : (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleCheckOut(visitor.id)}
                        disabled={visitor.check_out_time !== null}
                      >
                        Check Out
                      </button>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {visitor.check_out_time === null && (
                        <>
                          <Link
                            to={`/edit-visitor/${visitor.id}`} // Link to the EditVisitor component with visitorId as query parameter
                            className="btn btn-warning btn-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteVisitor(visitor.id)}
                            className="btn btn-error text-white btn-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                ))}
            </tbody>
          </table>
          </div>
          </div>
          <nav aria-label="Page navigation example">
  <ul className="list-style-none flex justify-center mt-4">
    <li>
      <button
        className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
        aria-label="Previous"
        onClick={() => {
          handlePaginationClick(currentPage - 1);
          window.scrollTo(0, 0); // Scroll to the top
        }}
        disabled={currentPage === 1}
      >
        <span aria-hidden="true">«</span>
      </button>
    </li>
    {paginationArray.map((pageNumber) => (
      <li key={pageNumber}>
        <button
          className={`relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white ${
            currentPage === pageNumber ? "text-white bg-primary" : ""
          }`}
          onClick={() => {
            handlePaginationClick(pageNumber);
            window.scrollTo(0, 0); // Scroll to the top
          }}
        >
          {pageNumber}
        </button>
      </li>
    ))}
    <li>
      <button
        className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
        aria-label="Next"
        onClick={() => {
          handlePaginationClick(currentPage + 1);
          window.scrollTo(0, 0); // Scroll to the top
        }}
        disabled={currentPage === totalPages}
      >
        <span aria-hidden="true">»</span>
      </button>
    </li>
  </ul>
</nav>

        
      
    </Sidebar>
  );
};

export default ViewVisitors;
