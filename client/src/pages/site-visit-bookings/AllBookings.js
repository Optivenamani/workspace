import React from "react";
import Sidebar from "../../components/Sidebar";

const AllBookings = () => {
  const siteVisits = [
    {
      marketer: "John Smith",
      site: "Dragon's Lair",
      location: "Nairobi",
      date: "2022-01-01",
      time: "10:00am",
      clients: 2,
    },
    {
      marketer: "Jane Doe",
      site: "Phoenix's Nest",
      location: "Mombasa",
      date: "2022-01-02",
      time: "11:00am",
      clients: 3,
    },
    {
      marketer: "Bob Johnson",
      site: "Unicorn's Grove",
      location: "Kisumu",
      date: "2022-01-03",
      time: "2:00pm",
      clients: 1,
    },
    {
      marketer: "Sara Lee",
      site: "Pegasus's Peak",
      location: "Eldoret",
      date: "2022-01-04",
      time: "9:00am",
      clients: 2,
    },
    {
      marketer: "Mark Davis",
      site: "Kraken's Reef",
      location: "Nakuru",
      date: "2022-01-05",
      time: "12:00pm",
      clients: 4,
    },
    {
      marketer: "Anna Nguyen",
      site: "Chimera's Den",
      location: "Kisii",
      date: "2022-01-06",
      time: "3:00pm",
      clients: 2,
    },
    {
      marketer: "Mike Patel",
      site: "Sphinx's Tomb",
      location: "Machakos",
      date: "2022-01-07",
      time: "10:00am",
      clients: 1,
    },
    {
      marketer: "Grace Wangari",
      site: "Cerberus's Lair",
      location: "Kakamega",
      date: "2022-01-08",
      time: "11:00am",
      clients: 3,
    },
    {
      marketer: "Peter Mbogo",
      site: "Hydra's Den",
      location: "Thika",
      date: "2022-01-09",
      time: "2:00pm",
      clients: 1,
    },
    {
      marketer: "Lucy Nyawira",
      site: "Minotaur's Maze",
      location: "Naivasha",
      date: "2022-01-10",
      time: "9:00am",
      clients: 2,
    },
    // add more site visits as needed
  ];
  
  

  return (
    <>
      <Sidebar>
        <div className="container px-4 py-6 mx-auto">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              {/* head */}
              <thead>
                <tr>
                  <th>#</th>
                  <th>Marketer Name</th>
                  <th>Site Visited</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Number of Clients</th>
                </tr>
              </thead>
              <tbody>
                {/* rows */}
                {siteVisits.map((siteVisit, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{siteVisit.marketer}</td>
                    <td>{siteVisit.site}</td>
                    <td>{siteVisit.location}</td>
                    <td>{siteVisit.date}</td>
                    <td>{siteVisit.time}</td>
                    <td>{siteVisit.clients}</td>
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

export default AllBookings;
