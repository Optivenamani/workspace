import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";

const ViewDrivers = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://workspace.optiven.co.ke/api/users", {
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

  const drivers = users.filter((user) => user.Accessrole === "driver69" || user.Accessrole === "112#114#700");

  console.log(drivers);

  const filteredDrivers = drivers.filter((driver) =>
    driver.fullnames.toLowerCase().includes(query.toLowerCase())
  );

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
                </tr>
              </thead>
              <tbody>
                {/* rows */}
                {filteredDrivers.map((driver, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{driver.fullnames}</td>
                    <td>{driver.email}</td>
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
