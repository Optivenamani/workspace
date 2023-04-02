import React from "react";
import Sidebar from "../../components/Sidebar";

const feedbackData = [
  {
    id: 1,
    name: "John Doe",
    phoneNumber: "0700123456",
    marketer: "Jane Smith",
    siteVisited: "ABC Site",
    dateVisited: "2022-04-01",
    likedSite: "Yes",
  },
  {
    id: 2,
    name: "Jane Doe",
    phoneNumber: "0711123456",
    marketer: "John Smith",
    siteVisited: "XYZ Site",
    dateVisited: "2022-03-28",
    likedSite: "No",
  },
  {
    id: 3,
    name: "Mary Johnson",
    phoneNumber: "0722123456",
    marketer: "Peter Parker",
    siteVisited: "LMN Site",
    dateVisited: "2022-03-25",
    likedSite: "Yes",
  },
  {
    id: 4,
    name: "Tom Smith",
    phoneNumber: "0733123456",
    marketer: "Sara Jones",
    siteVisited: "DEF Site",
    dateVisited: "2022-03-20",
    likedSite: "No",
  },
  {
    id: 5,
    name: "David Brown",
    phoneNumber: "0744123456",
    marketer: "Emma Stone",
    siteVisited: "GHI Site",
    dateVisited: "2022-03-15",
    likedSite: "Yes",
  },
  {
    id: 6,
    name: "Sarah Lee",
    phoneNumber: "0755123456",
    marketer: "Tom Johnson",
    siteVisited: "PQR Site",
    dateVisited: "2022-03-10",
    likedSite: "No",
  },
  {
    id: 7,
    name: "Mike Davis",
    phoneNumber: "0766123456",
    marketer: "Anna Brown",
    siteVisited: "STU Site",
    dateVisited: "2022-03-05",
    likedSite: "Yes",
  },
  {
    id: 8,
    name: "Olivia White",
    phoneNumber: "0777123456",
    marketer: "Bob Green",
    siteVisited: "VWX Site",
    dateVisited: "2022-03-01",
    likedSite: "No",
  },
  {
    id: 9,
    name: "Chris Harris",
    phoneNumber: "0788123456",
    marketer: "Karen Lewis",
    siteVisited: "YZA Site",
    dateVisited: "2022-02-25",
    likedSite: "Yes",
  },
  {
    id: 10,
    name: "Kim Kim",
    phoneNumber: "0799123456",
    marketer: "Jerry Lee",
    siteVisited: "BCD Site",
    dateVisited: "2022-02-20",
    likedSite: "No",
  }
];

const ClientsFeedback = () => {
  return (
    <>
      <Sidebar>
        <div className="container px-4 py-6 mx-auto">
          <h1 className="text-xl font-bold mb-4">Client Feedback</h1>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Marketer</th>
                  <th>Site Visited</th>
                  <th>Date of Visit</th>
                  <th>Liked Site?</th>
                </tr>
              </thead>
              <tbody>
                {feedbackData.map((feedback) => (
                  <tr key={feedback.id}>
                    <td>{feedback.name}</td>
                    <td>{feedback.phoneNumber}</td>
                    <td>{feedback.marketer}</td>
                    <td>{feedback.siteVisited}</td>
                    <td>{feedback.dateVisited}</td>
                    <td>{feedback.likedSite}</td>
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

export default ClientsFeedback;
