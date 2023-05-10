import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";

const Users = () => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://209.38.246.14:8080/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchUsers();
  }, [token]);

  const filteredUsers = users.filter((user) =>
    user.fullnames.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Sidebar>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex justify-center items-center mb-4 mt-2">
          <input
            placeholder="Search User by Name"
            className="input input-bordered w-full max-w-xs"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto card bg-base-100 shadow-xl">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.fullnames.toUpperCase()}</td>
                  <td>{user.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Sidebar>
  );
};

export default Users;
