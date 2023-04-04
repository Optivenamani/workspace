import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

const ViewDrivers = () => {
  const [searchText, setSearchText] = useState("");
  const drivers = [
    {
      name: "Oliver Schmidt",
      email: "oliver.schmidt@example.com",
      phone: "123-456-7890",
      address: "123 Main St, Berlin, Germany",
    },
    {
      name: "Emma Braun",
      email: "emma.braun@example.com",
      phone: "234-567-8901",
      address: "456 Second St, Munich, Germany",
    },
    {
      name: "Noah Wagner",
      email: "noah.wagner@example.com",
      phone: "345-678-9012",
      address: "789 Third St, Hamburg, Germany",
    },
    {
      name: "Sophia Schäfer",
      email: "sophia.schäfer@example.com",
      phone: "456-789-0123",
      address: "987 Fourth St, Frankfurt, Germany",
    },
    {
      name: "Lukas Müller",
      email: "lukas.müller@example.com",
      phone: "567-890-1234",
      address: "654 Fifth St, Stuttgart, Germany",
    },
    {
      name: "Lea Meyer",
      email: "lea.meyer@example.com",
      phone: "678-901-2345",
      address: "321 Sixth St, Düsseldorf, Germany",
    },
    {
      name: "Maximilian Weber",
      email: "maximilian.weber@example.com",
      phone: "789-012-3456",
      address: "789 Seventh St, Cologne, Germany",
    },
    {
      name: "Mia Wagner",
      email: "mia.wagner@example.com",
      phone: "890-123-4567",
      address: "654 Eighth St, Dortmund, Germany",
    },
    {
      name: "Elias Becker",
      email: "elias.becker@example.com",
      phone: "901-234-5678",
      address: "321 Ninth St, Essen, Germany",
    },
    {
      name: "Anna Schulz",
      email: "anna.schulz@example.com",
      phone: "012-345-6789",
      address: "987 Tenth St, Bremen, Germany",
    },
  ];

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchText.toLowerCase())
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
              onChange={(e) => setSearchText(e.target.value)}
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
                    <td>{driver.name}</td>
                    <td>{driver.email}</td>
                    <td>{driver.phone}</td>
                    <td>{driver.address}</td>
                    <td>
                      <button className="btn btn-sm btn-warning mr-2 text-white">
                        Edit
                      </button>
                      <button className="btn btn-sm btn-error text-white">
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
