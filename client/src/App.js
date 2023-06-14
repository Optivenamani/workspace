import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
// Redux
import {
  addNotification,
  fetchNotifications,
} from "./redux/logistics/features/notifications/notificationsSlice";
// utils
import PrivateRoutes from "./utils/PrivateRoutes";
// pages
import {
  AllClientsContacts,
  AllSiteVisits,
  AppMenu,
  ApprovedBookings,
  ApprovedSiteVisitsReports,
  ApprovedSVDetails,
  AssignedBookings,
  AssignedVehicleRequests,
  ClientsFeedback,
  CreateBooking,
  CreateVehicle,
  Dashboard,
  EditSiteVisit,
  EditVehicle,
  Home,
  Login,
  MarketersFeedback,
  MostBookedSitesReports,
  MyClientContacts,
  MySiteVisits,
  Notifications,
  PastRequests,
  RequestVehicle,
  SiteVisitDetails,
  SiteVisitRequests,
  SiteVisitsSummary,
  Survey,
  Users,
  VehicleRequestDetails,
  VehicleRequests,
  ViewDrivers,
  ViewSites,
  ViewVehicles,
} from "./utils/index";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io("https://workspace.optiven.co.ke");

    dispatch(fetchNotifications());

    socket.on("siteVisitRejected", (notification) => {
      console.log("Site visit rejected");
      // Update the notifications state
      dispatch(
        addNotification({
          type: "rejected",
          message: "Your site visit request has been rejected :(",
          remarks: notification.remarks,
          timestamp: new Date(notification.timestamp),
          isRead: false,
        })
      );
    });

    socket.on("siteVisitApproved", (notification) => {
      console.log("Site visit approved");
      // Update the notifications state
      dispatch(
        addNotification({
          type: "approved",
          message: "Your site visit request has been approved!",
          remarks: notification.remarks,
          timestamp: new Date(notification.timestamp),
          isRead: false,
          site_visit_id: notification.site_visit_id,
        })
      );
    });

    socket.on("siteVisitCompleted", (notification) => {
      dispatch(
        addNotification({
          type: "completed",
          message: "A site visit has been completed. Please fill the survey",
          site_visit_id: notification.site_visit_id,
          timestamp: new Date(notification.timestamp),
          isRead: false,
        })
      );
    });

    return () => {
      // Remove event listeners
      socket.off("connect");
      socket.off("disconnect");
      socket.off("siteVisitRejected");
      socket.off("siteVisitApproved");
      socket.off("siteVisitCompleted");
    };
  }, [dispatch]);

  return (
    <>
      <Router>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/" exact element={<PrivateRoutes />}>
            {/* App Menu */}
            <Route path="/" element={<AppMenu />} />
            {/* Home */}
            <Route path="/logistics-home" element={<Home />} />
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
            <Route path="/edit-site-visit/:id" element={<EditSiteVisit />} />
            {/* Sites */}
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
            <Route path="/sv-details/:id" element={<ApprovedSVDetails />} />
            {/* Survey */}
            <Route path="/survey/:id" element={<Survey />} />
            {/* Reports */}
            <Route
              path="/site-visits-summary-reports"
              element={<SiteVisitsSummary />}
            />
            <Route
              path="/approved-site-visit-reports"
              element={<ApprovedSiteVisitsReports />}
            />
            <Route
              path="/most-booked-sites-reports"
              element={<MostBookedSitesReports />}
            />
            <Route
              path="/marketers-feedback-reports"
              element={<MarketersFeedback />}
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
