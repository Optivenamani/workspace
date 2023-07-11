import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { useSelector } from "react-redux";

const formatDate = (dateTimeString) => {
  if (!dateTimeString) return null;
  const dateTime = new Date(dateTimeString);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
  };
  return dateTime.toLocaleDateString("en-CA", options).replace(/\//g, "-");
};

const ViewReservedParking = () => {
  const [reservedParking, setReservedParking] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    const fetchReservedParking = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/reserved-parking",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
      parking.vehicle_registration
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
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
                <th className="text-center">Name</th>
                <th className="text-center">Vehicle Registration</th>
                <th className="text-center">Estimated Arrival Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservedParking.map((parking, i) => (
                <tr key={parking.id}>
                  <td>{i + 1}</td>
                  <td className="text-center">{parking.name}</td>
                  <td className="text-center">
                    {parking.vehicle_registration}
                  </td>
                  <td className="text-center">
                    {formatDate(parking.arrival_time)}
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
