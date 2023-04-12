import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewDrivers = () => {
  const [query, setQuery] = useState("");
  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/drivers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, [token]);

  const filteredDrivers = drivers.filter((driver) =>
    driver.driver_name.toLowerCase().includes(query.toLowerCase())
  );

  const editDriver = (driverId) => {
    // Navigate to the edit driver page with the driver ID as a parameter
    navigate(`/drivers/edit/${driverId}`);
  };

  const deleteDriver = (driverId) => {
    const token = localStorage.getItem("token");
    // Send a DELETE request to the server to delete the driver with the specified ID
    fetch(`http://localhost:8080/api/drivers/${driverId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Remove the driver from the drivers state
        setDrivers((prevDrivers) =>
          prevDrivers.filter((driver) => driver.driver_id !== driverId)
        );
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <>
      <Sidebar>
        <div className="container px-4 py-6 mx-auto">
          <div className="flex justify-center items-center mb-4">
            <input
              placeholder="Search Driver by Name"
              className="input input-bordered w-full max-w-xs"
              type="text"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto card bg-base-100 shadow-xl">
            <table className="table table-zebra w-full">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* rows */}
                {filteredDrivers.map((driver, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{driver.driver_name}</td>
                    <td>{driver.driver_email}</td>
                    <td>{driver.driver_phone_number}</td>
                    <td>{driver.driver_address}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning mr-2 text-white"
                        onClick={() => editDriver(driver.driver_id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-error text-white"
                        onClick={() => deleteDriver(driver.driver_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default ViewDrivers;
