import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";

const AllClientsContacts = () => {
  const [clients, setClients] = useState([]);
  const [query, setQuery] = useState("");
  const token = useSelector((state) => state.user.token);
  const userId = useSelector((state) => state.user.user.user_id);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          `https://workspace.optiven.co.ke/api/clients/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchClients();
  }, [token, userId]);

  console.log(clients);

  const filteredClients = clients.filter((client) => {
    return client.name.toLowerCase().includes(query.toLowerCase());
  });
  return (
    <Sidebar>
      <div className="flex justify-center items-center mt-2 mb-2">
        <input
          placeholder="Search Client by Name"
          className="input input-bordered w-full max-w-xs"
          type="text"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="container px-4 mx-auto">
        <div className=" my-4 flex justify-center">
          <div className="overflow-x-auto w-screen card bg-base-100 shadow-xl mb-10">
            <table className="table table-zebra w-full">
              {/* head */}
              <thead>
                <tr>
                  <th>INDEX</th>
                  <th>Client Name</th>
                  <th>Client Phone Number</th>
                  <th>Client Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{client.name}</td>
                    <td>{client.phone_number}</td>
                    <td>{client.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default AllClientsContacts;
