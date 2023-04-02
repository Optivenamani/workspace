import React from "react";
import Sidebar from "../../components/Sidebar";

const AssignedBookings = () => {
  const bookings = [
    {
      id: 1,
      pickupLocation: "123 Main St",
      siteName: "Site 1",
      passengers: 4,
      date: "2023-04-15",
      time: "10:00 AM",
    },
    {
      id: 2,
      pickupLocation: "456 Oak St",
      siteName: "Site 2",
      passengers: 2,
      date: "2023-04-16",
      time: "2:00 PM",
    },
    {
      id: 3,
      pickupLocation: "789 Elm St",
      siteName: "Site 3",
      passengers: 3,
      date: "2023-03-17",
      time: "1:00 PM",
    },
    {
      id: 4,
      pickupLocation: "345 Pine St",
      siteName: "Site 4",
      passengers: 6,
      date: "2023-03-18",
      time: "9:00 AM",
    },
  ];

  const latestBookings = bookings.slice(0, 2); // Show the two latest assigned site visits
  const pastBookings = bookings.slice(2);

  return (
    <>
      <Sidebar>
        <div className="container px-4 py-6 mx-auto">
          <div className="flex flex-col md:flex-row">
            <div className="overflow-x-auto md:w-1/2 md:pr-4">
              <h2 className="text-lg font-bold mb-2">Latest Site Visits</h2>
              <table className="table table-zebra w-full md:w-3/4">
                <thead>
                  <tr>
                    <th>Site Visit ID</th>
                    <th>Pickup Location</th>
                    <th>Site Name</th>
                    <th>Passengers</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {latestBookings.map((booking) => (
                    <tr key={booking.id} className="bg-green-200">
                      <td>{booking.id}</td>
                      <td>{booking.pickupLocation}</td>
                      <td>{booking.siteName}</td>
                      <td>{booking.passengers}</td>
                      <td>{booking.date}</td>
                      <td>{booking.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="overflow-x-auto md:w-1/2 md:pl-4 mt-4 md:mt-0">
              <h2 className="text-lg font-bold mb-2">Past Site Visits</h2>
              <table className="table table-zebra w-full md:w-3/4">
                <thead>
                  <tr>
                    <th>Site Visit ID</th>
                    <th>Pickup Location</th>
                    <th>Site Name</th>
                    <th>Passengers</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {pastBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.pickupLocation}</td>
                      <td>{booking.siteName}</td>
                      <td>{booking.passengers}</td>
                      <td>{booking.date}</td>
                      <td>{booking.time}</td>
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

export default AssignedBookings;
