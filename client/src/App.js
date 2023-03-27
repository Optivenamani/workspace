import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// components
import Navbar from "./components/Navbar";
// pages
import Dashboard from "./pages/Dashboard";
import MyBookings from "./pages/MyBookings";
import CreateBooking from "./pages/CreateBooking";
import AssignedBookings from "./pages/AssignedBookings";
import ApprovedBookings from "./pages/ApprovedBookings";
import AllBookings from "./pages/AllBookings";
import CreateSite from "./pages/CreateSite";
import ViewSites from "./pages/ViewSites";
import CreateVehicle from "./pages/CreateVehicle";
import ViewVehicles from "./pages/ViewVehicles";
import RequestVehicle from "./pages/RequestVehicle";
import ClientContacts from "./pages/ClientContacts";
import ClientsFeedback from "./pages/ClientsFeedback";

const App = () => {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/create-booking" element={<CreateBooking />} />
          <Route path="/assigned-bookings" element={<AssignedBookings />} />
          <Route path="/approved-bookings" element={<ApprovedBookings />} />
          <Route path="/all-bookings" element={<AllBookings />} />
          <Route path="/create-site" element={<CreateSite />} />
          <Route path="/view-sites" element={<ViewSites />} />
          <Route path="/create-vehicle" element={<CreateVehicle />} />
          <Route path="/view-vehicles" element={<ViewVehicles />} />
          <Route path="/request-vehicle" element={<RequestVehicle />} />
          <Route path="/clients-contacts" element={<ClientContacts />} />
          <Route path="/clients-feedback" element={<ClientsFeedback />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
