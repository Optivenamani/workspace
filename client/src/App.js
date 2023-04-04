import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// utils
import PrivateRoutes from "./utils/PrivateRoutes";
// pages
import Dashboard from "./pages/Dashboard";
import MyBookings from "./pages/site-visit-bookings/MyBookings";
import CreateBooking from "./pages/site-visit-bookings/CreateBooking";
import AssignedBookings from "./pages/site-visit-bookings/AssignedBookings";
import ApprovedBookings from "./pages/site-visit-bookings/ApprovedBookings";
import AllBookings from "./pages/site-visit-bookings/AllBookings";
import CreateSite from "./pages/sites/CreateSite";
import ViewSites from "./pages/sites/ViewSites";
import CreateVehicle from "./pages/vehicles/CreateVehicle";
import ViewVehicles from "./pages/vehicles/ViewVehicles";
import RequestVehicle from "./pages/vehicles/RequestVehicle";
import ClientContacts from "./pages/clients/ClientContacts";
import ClientsFeedback from "./pages/clients/ClientsFeedback";
import AddDriver from "./pages/drivers/AddDriver";
import ViewDrivers from "./pages/drivers/ViewDrivers";
import Users from "./pages/Users";
import SiteVisitRequests from "./pages/site-visit-bookings/SiteVisitRequests";
import Home from "./pages/Home";
import Notifications from "./pages/Notification";
import Login from "./pages/Login";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            {/* Home */}
            <Route path="/" element={<Home />} />
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Site Visit Bookings */}
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/create-booking" element={<CreateBooking />} />
            <Route path="/assigned-bookings" element={<AssignedBookings />} />
            <Route path="/approved-bookings" element={<ApprovedBookings />} />
            <Route path="/all-bookings" element={<AllBookings />} />
            <Route path="/bookings-requests" element={<SiteVisitRequests />} />
            {/* Sites */}
            <Route path="/create-site" element={<CreateSite />} />
            <Route path="/view-sites" element={<ViewSites />} />
            {/* Vehicles */}
            <Route path="/create-vehicle" element={<CreateVehicle />} />
            <Route path="/view-vehicles" element={<ViewVehicles />} />
            <Route path="/request-vehicle" element={<RequestVehicle />} />
            {/* Clients */}
            <Route path="/clients-contacts" element={<ClientContacts />} />
            <Route path="/clients-feedback" element={<ClientsFeedback />} />
            {/* Drivers */}
            <Route path="/create-driver" element={<AddDriver />} />
            <Route path="/view-drivers" element={<ViewDrivers />} />
            {/* Users */}
            <Route path="/users" element={<Users />} />
            {/* Notifications */}
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
