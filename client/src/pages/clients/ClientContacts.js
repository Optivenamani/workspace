import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

const ClientContacts = () => {
  const [query, setQuery] = useState("");
  const clientData = [
    {
      name: "John Smith",
      phone: "0712345678",
      email: "client1@mail.com",
      marketer: "John Smith",
    },
    {
      name: "Abdi Abdul",
      phone: "0723456789",
      email: "client2@mail.com",
      marketer: "Jane Doe",
    },
    {
      name: "Sara Torres",
      phone: "0734567890",
      email: "client3@mail.com",
      marketer: "Bob Johnson",
    },
    {
      name: "Alice Brown",
      phone: "0745678901",
      email: "client4@mail.com",
      marketer: "Sara Lee",
    },
    {
      name: "Tom White",
      phone: "0756789012",
      email: "client5@mail.com",
      marketer: "Mark Davis",
    },
    {
      name: "Linda Green",
      phone: "0767890123",
      email: "client6@mail.com",
      marketer: "Anna Nguyen",
    },
    {
      name: "David Lee",
      phone: "0778901234",
      email: "client7@mail.com",
      marketer: "Mike Patel",
    },
    {
      name: "Emily Davis",
      phone: "0789012345",
      email: "client8@mail.com",
      marketer: "Grace Wangari",
    },
    {
      name: "Andrew Chen",
      phone: "0790123456",
      email: "client9@mail.com",
      marketer: "Peter Mbogo",
    },
    {
      name: "Jessica Kim",
      phone: "0710234567",
      email: "client10@mail.com",
      marketer: "Lucy Nyawira",
    },
  ];

  const filteredClients = clientData.filter((client) => {
    return client.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <>
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
          <h1 className="text-xl font-bold mb-4">Client Contacts</h1>
          <div className=" my-4 flex justify-center">
            <div className="overflow-x-auto w-screen card bg-base-100 shadow-xl">
              <table className="table table-zebra w-full">
                {/* head */}
                <thead>
                  <tr>
                    <th>INDEX</th>
                    <th>Client Name</th>
                    <th>Client Phone Number</th>
                    <th>Client Email</th>
                    <th>Marketer attached to</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{client.name}</td>
                      <td>{client.phone}</td>
                      <td>{client.email}</td>
                      <td>{client.marketer}</td>
                      <td>
                        <button className="btn btn-warning btn-outline btn-sm">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default ClientContacts;
