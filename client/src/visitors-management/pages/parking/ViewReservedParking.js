import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date
    .toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");
};

const ViewReservedParking = () => {
  const [reservedParking, setReservedParking] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchReservedParking = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/reserved-parking", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Reserved Parking:", data);

        if (Array.isArray(data)) {
          setReservedParking(data);
        } else {
          console.error("Invalid response format. Expected an array.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservedParking();
  }, [token]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredReservedParking = reservedParking.filter(
    (parking) =>
      parking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parking.vehicleRegistration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Sidebar>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex justify-center mb-4">
          <input
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2 mr-2 w-72"
            placeholder="Search by name or vehicle registration"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="btn btn-primary">Search</button>
        </div>
        <div className="overflow-x-auto card bg-base-100 shadow-xl">
          <table className="table table-compact">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Vehicle Registration</th>
                <th>Estimated Arrival Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservedParking.map((parking, i) => (
                <tr key={parking.id}>
                  <td>{i + 1}</td>
                  <td>{parking.name}</td>
                  <td>{parking.vehicleRegistration}</td>
                  <td>{parking.estimatedArrivalTime}</td>
                  <td>
                    <div className="flex gap-2">
                      {/* Add your actions buttons here */}
                    </div>
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

export default ViewReservedParking;
