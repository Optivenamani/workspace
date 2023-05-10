import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewDrivers = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://209.38.246.14:8080/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  const drivers = users.filter((user) => user.Accessrole === "driver69");

  console.log(drivers);

  const filteredDrivers = drivers.filter((driver) =>
    driver.fullnames.toLowerCase().includes(query.toLowerCase())
  );

  const editDriver = (driverId) => {
    // Navigate to the edit driver page with the driver ID as a parameter
    navigate(`/drivers/edit/${driverId}`);
  };

  const deleteDriver = (driverId) => {
    const token = localStorage.getItem("token");
    // Send a DELETE request to the server to delete the driver with the specified ID
    fetch(`http://209.38.246.14:8080/api/users/${driverId}`, {
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
        setUsers((prevUsers) =>
          prevUsers.filter((driver) => driver.user_id !== driverId)
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
                  <th>Index</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* rows */}
                {filteredDrivers.map((driver, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{driver.fullnames}</td>
                    <td>{driver.email}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning mr-2 text-white"
                        onClick={() => editDriver(driver.user_id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-error text-white"
                        onClick={() => deleteDriver(driver.user_id)}
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
