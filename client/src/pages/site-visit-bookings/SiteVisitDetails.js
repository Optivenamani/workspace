import React from "react";
import Sidebar from "../../components/Sidebar";

const SiteVisitDetails = () => {
  return (
    <>
      <Sidebar>
        <div>
          <h1>Site Name: Something Garden</h1>
          <h2>Pickup Location: ABSA Towers</h2>
          <h3>Pickup Date: 12-11-2023</h3>
          <h3>Pickup Time: 12.00am</h3>
          <h4>Number of Clients: 2</h4>
          <h5>Assign vehicle: *Dropdown menu of available vehicles*</h5>
          <button className="btn btn-outline">Accept Site Visit Request</button>
        </div>
      </Sidebar>
    </>
  );
};

export default SiteVisitDetails;
