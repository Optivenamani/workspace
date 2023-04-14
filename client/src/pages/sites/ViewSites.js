import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useSelector } from "react-redux";

const ViewSites = () => {
  const [searchText, setSearchText] = useState("");
  const [sites, setSites] = useState([]);
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/sites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setSites(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchSites();
  }, [token]);

  const filteredSites = sites.filter((site) =>
    site.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Sidebar>
        <div className="container px-4 pb-6 mx-auto">
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
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.map((site, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{site.name}</td>
                    <td>
                      {site.link ? (
                        <a href={site.link} className="hover:underline">{site.link}</a>
                      ) : (
                        "Unavailable"
                      )}
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
