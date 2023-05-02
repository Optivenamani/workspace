import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// utils
import PrivateRoutes from "./utils/PrivateRoutes";
// pages
import Dashboard from "./pages/Dashboard";
import MySiteVisits from "./pages/site-visit-requests/MySiteVisits";
import CreateBooking from "./pages/site-visit-requests/CreateBooking";
import AssignedBookings from "./pages/site-visit-requests/AssignedBookings";
import ApprovedBookings from "./pages/site-visit-requests/ApprovedBookings";
import AllSiteVisits from "./pages/site-visit-requests/AllSiteVisits";
import CreateSite from "./pages/sites/CreateSite";
import ViewSites from "./pages/sites/ViewSites";
import CreateVehicle from "./pages/vehicles/CreateVehicle";
import ViewVehicles from "./pages/vehicles/ViewVehicles";
import RequestVehicle from "./pages/vehicles/RequestVehicle";
import MyClientContacts from "./pages/clients/MyClientContacts";
import ClientsFeedback from "./pages/clients/ClientsFeedback";
import ViewDrivers from "./pages/drivers/ViewDrivers";
import Users from "./pages/Users";
import SiteVisitRequests from "./pages/site-visit-requests/SiteVisitRequests";
import Home from "./pages/Home";
import Notifications from "./pages/Notification";
import Login from "./pages/Login";
import SiteVisitDetails from "./pages/site-visit-requests/SiteVisitDetails";
import EditVehicle from "./pages/vehicles/EditVehicle";
import VehicleRequests from "./pages/vehicles/VehicleRequests";
import VehicleRequestDetails from "./pages/vehicles/VehicleRequestDetails";
import AssignedVehicleRequests from "./pages/vehicles/AssignedVehicleRequests";
import PastRequests from "./pages/vehicles/PastRequests";
import AllClientsContacts from "./pages/clients/AllClientsContacts";

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
            <Route path="/my-site-visits" element={<MySiteVisits />} />
            <Route path="/book-site-visit" element={<CreateBooking />} />
            <Route
              path="/assigned-site-visits"
              element={<AssignedBookings />}
            />
            <Route
              path="/approved-site-visits"
              element={<ApprovedBookings />}
            />
            <Route path="/all-site-visits" element={<AllSiteVisits />} />
            <Route
              path="/site-visit-requests"
              element={<SiteVisitRequests />}
            />
            <Route
              path="/site-visit-requests/:id"
              element={<SiteVisitDetails />}
            />
            {/* Sites */}
            <Route path="/create-site" element={<CreateSite />} />
            <Route path="/view-sites" element={<ViewSites />} />
            {/* Vehicles */}
            <Route path="/create-vehicle" element={<CreateVehicle />} />
            <Route path="/vehicles" element={<ViewVehicles />} />
            <Route path="/request-vehicle" element={<RequestVehicle />} />
            <Route path="/vehicles/:id" element={<EditVehicle />} />
            <Route path="/vehicle-requests" element={<VehicleRequests />} />
            <Route path="/past-vehicle-requests" element={<PastRequests />} />
            <Route
              path="/vehicle-request-details/:id"
              element={<VehicleRequestDetails />}
            />
            {/* Clients */}
            <Route path="/my-clients-contacts" element={<MyClientContacts />} />
            <Route
              path="/all-clients-contacts"
              element={<AllClientsContacts />}
            />
            <Route path="/clients-feedback" element={<ClientsFeedback />} />
            {/* Drivers */}
            <Route path="/drivers" element={<ViewDrivers />} />
            <Route
              path="/assigned-vehicle-requests"
              element={<AssignedVehicleRequests />}
            />
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
