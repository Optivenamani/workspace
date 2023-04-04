import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

const ViewSites = () => {
  const [searchText, setSearchText] = useState("");
  const sites = [
    {
      name: "Harlem",
      location: "New York City, NY",
    },
    {
      name: "Bronzeville",
      location: "Chicago, IL",
    },
    {
      name: "Watts",
      location: "Los Angeles, CA",
    },
    {
      name: "Bedford-Stuyvesant",
      location: "Brooklyn, NY",
    },
    {
      name: "Oakland",
      location: "Oakland, CA",
    },
    {
      name: "The Hill District",
      location: "Pittsburgh, PA",
    },
  ];

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Sidebar>
        <div className="container px-4 py-6 mx-auto">
          <div className="flex justify-center items-center my-4">
            <input
              placeholder="Search Site by Name"
              className="input input-bordered w-full max-w-xs"
              type="text"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto card bg-base-100 shadow-xl">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Site Name</th>
                  <th>Site Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.map((site, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{site.name}</td>
                    <td>{site.location}</td>
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

export default ViewSites;
