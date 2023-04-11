import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

const ApprovedBookings = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState([
    {
      id: 1,
      site: "Tatooine",
      location: "Koinange Street",
      date: "2023-03-12",
      time: "12:00",
      clients: 2,
    },
    {
      id: 2,
      site: "Hogwarts",
      location: "Tom Mboya Street",
      date: "2023-03-14",
      time: "10:00",
      clients: 3,
    },
    {
      id: 3,
      site: "Jurassic Park",
      location: "Moi Avenue",
      date: "2023-03-15",
      time: "14:00",
      clients: 4,
    },
    {
      id: 4,
      site: "Neverland",
      location: "Kimathi Street",
      date: "2023-03-17",
      time: "16:00",
      clients: 2,
    },
    {
      id: 5,
      site: "Hobbiton",
      location: "Biashara Street",
      date: "2023-03-18",
      time: "11:00",
      clients: 5,
    },
    {
      id: 6,
      site: "Gotham City",
      location: "River Road",
      date: "2023-03-19",
      time: "13:00",
      clients: 1,
    },
    {
      id: 7,
      site: "Asgard",
      location: "Luthuli Avenue",
      date: "2023-03-20",
      time: "15:00",
      clients: 3,
    },
    {
      id: 8,
      site: "Narnia",
      location: "Mama Ngina Street",
      date: "2023-03-22",
      time: "12:00",
      clients: 2,
    },
    {
      id: 9,
      site: "Hogwarts",
      location: "Haile Selassie Avenue",
      date: "2023-03-23",
      time: "10:00",
      clients: 4,
    },
    {
      id: 10,
      site: "Gotham City",
      location: "Kirinyaga Road",
      date: "2023-03-25",
      time: "13:00",
      clients: 2,
    },
  ]);
  

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date);
    const startDateObj = startDate && new Date(startDate);
    const endDateObj = endDate && new Date(endDate);

    if (startDateObj && endDateObj) {
      return itemDate >= startDateObj && itemDate <= endDateObj;
    } else if (startDate) {
      return itemDate >= startDateObj;
    } else if (endDateObj) {
      return itemDate <= endDateObj;
    } else {
      return true;
    }
  });

  return (
    <>
      <Sidebar>
        <div className="flex justify-center items-center mt-2 mb-2">
          <div className="flex space-x-2 items-center">
            <input
              type="date"
              className="input input-bordered max-w-xs mt-2"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <span className="text-lg font-bold">to</span>
            <input
              type="date"
              className="input input-bordered max-w-xs mt-2"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
        <div className="px-4 mt-4 flex justify-center">
          <div className="overflow-x-auto w-screen card bg-base-100 shadow-xl">
            <table className="table table-zebra w-full">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Site</th>
                  <th>Pickup Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Clients</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <th>{item.id}</th>
                    <td>{item.site}</td>
                    <td>{item.location}</td>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td>{item.clients}</td>
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

export default ApprovedBookings;
