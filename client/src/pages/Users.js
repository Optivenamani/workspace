import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const Users = () => {
  const [searchText, setSearchText] = useState("");
  
  const users = [
    {
      id: 1,
      name: "Kamau Njoroge",
      role: "Marketer",
    },
    {
      id: 2,
      name: "Nekesa Wamalwa",
      role: "Data Analyst",
    },
    {
      id: 3,
      name: "Mutua Kaluki",
      role: "Head of Logistics",
    },
    {
      id: 4,
      name: "Nyambura Kimani",
      role: "Marketer",
    },
    {
      id: 5,
      name: "Kerubo Nyakundi",
      role: "GM",
    },
    {
      id: 6,
      name: "Kinyanjui Wainaina",
      role: "Marketer",
    },
    {
      id: 7,
      name: "Adhiambo Ochieng",
      role: "Director",
    },
    {
      id: 8,
      name: "Njoki Gichuru",
      role: "Marketer",
    },
    {
      id: 9,
      name: "Onyango Omondi",
      role: "HOS",
    },
    {
      id: 10,
      name: "Sara Müller",
      role: "Marketing Manager",
    },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
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
                <th></th>
                <th>Name</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="btn btn-sm btn-outline btn-warning">Edit</button>
                    <button className="btn btn-sm btn-error text-white ml-1">
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
  );
};

export default Users;
