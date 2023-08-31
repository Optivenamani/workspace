import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  fetchActiveSiteVisits,
  selectActiveSiteVisits,
  fetchPendingSiteVisits,
  fetchAssignedSiteVisits,
} from "../../redux/logistics/features/siteVisit/siteVisitSlice";
import { fetchPendingVehicleRequests } from "../../redux/logistics/features/vehicleRequest/vehicleRequestSlice";
import { fetchNotifications } from "../../redux/logistics/features/notifications/notificationsSlice";
import "./Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = ({ children }) => {
  const [, setCanBookSiteVisit] = useState(true);
  const [latestNotification, setLatestNotification] = useState(null);

  const accessRole = useSelector((state) => state.user.accessRole).trim();

  const activeVisits = useSelector(selectActiveSiteVisits);
  const siteVisitStatus = useSelector((state) => state.siteVisit.status);
  const pendingVisits = useSelector((state) => state.siteVisit.pendingVisits);
  const pendingVehicleRequests = useSelector(
    (state) => state.vehicleRequest.pendingVehicleRequests
  );
  const assignedBookings = useSelector((state) => state.siteVisit);

  console.log(assignedBookings);
  const numAssignedSiteVisits = useSelector((state) =>
    Array.isArray(state.siteVisit.assignedVisits)
      ? state.siteVisit.assignedVisits.length
      : 0
  );

  console.log(numAssignedSiteVisits);

  const accessRoles = accessRole.split("#");

  const isMarketer = accessRoles.includes("113");
  const isHOS = accessRoles.includes("hos");
  const isGM = accessRoles.includes("gm");
  const isDriver = accessRoles.includes("driver");
  const isHOL = accessRoles.includes("headOfLogistics");
  const isAnalyst = accessRoles.includes("dataAnalyst");
  const isAdmin = accessRoles.includes("logisticsAdmin");
  const isOperations = accessRoles.includes("operations");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchActiveSiteVisits());
    dispatch(fetchPendingSiteVisits());
    dispatch(fetchPendingVehicleRequests());
    dispatch(fetchAssignedSiteVisits());
    dispatch(fetchAssignedSiteVisits());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchActiveSiteVisits());

    dispatch(fetchNotifications())
      .unwrap()
      .then((notificationsData) => {
        const latestNotification = notificationsData.notifications[0];
        setLatestNotification(latestNotification); // Store the latest notification in state
        if (
          latestNotification.type === "approved" &&
          moment().diff(latestNotification.timestamp, "hours") > 24
        ) {
          setCanBookSiteVisit(false);
        }
      });
  }, [dispatch]);

  const shouldDisableSiteVisitButton = () => {
    if (
      latestNotification &&
      latestNotification.type === "approved" &&
      moment().diff(latestNotification.timestamp, "hours") > 24
    ) {
      return true;
    }

    if (hasActiveSiteVisit) {
      for (const visit of activeVisits) {
        if (
          visit.status === "in_progress" ||
          visit.status === "complete" ||
          visit.status === "reviewed"
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const hasActiveSiteVisit =
    siteVisitStatus === "succeeded" && activeVisits.length > 0;

  const numPendingSiteVisits =
    Array.isArray(pendingVisits) && pendingVisits.length; // Get the number of pending site visits
  const hasPendingSiteVisits = numPendingSiteVisits > 0;

  const numPendingVehicleRequests =
    Array.isArray(pendingVehicleRequests) && pendingVehicleRequests.length; // Get the number of pending site visits
  const hasPendingVehicleRequests = numPendingVehicleRequests > 0;

  return (
    <>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content overflow-visible">{children}</div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            {/* Home */}
            <li>
              <Link to="/logistics-home" className="font-bold my-1">
                Home
              </Link>
            </li>
            {/* Dashboard */}
            {(isHOS ||
              isGM ||
              isAdmin ||
              isHOL ||
              isAnalyst ||
              isOperations) && (
              <li>
                <Link to="/dashboard" className="font-bold my-1">
                  Dashboard
                </Link>
              </li>
            )}
            {/* Reports */}
            {(isHOS ||
              isGM ||
              isAdmin ||
              isHOL ||
              isAnalyst ||
              isOperations) && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Reports</div>
                <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                  {(isHOS ||
                    isGM ||
                    isAdmin ||
                    isHOL ||
                    isAnalyst ||
                    isOperations) && (
                    <Link
                      to="/approved-site-visit-reports"
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    >
                      Approved Site Visits
                    </Link>
                  )}
                  {(isHOS ||
                    isGM ||
                    isAdmin ||
                    isHOL ||
                    isAnalyst ||
                    isOperations) && (
                    <Link
                      to="/site-visits-summary-reports"
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    >
                      Site Visits Summary
                    </Link>
                  )}
                  {(isHOS ||
                    isGM ||
                    isAdmin ||
                    isHOL ||
                    isAnalyst ||
                    isOperations) && (
                    <Link
                      to="/most-booked-sites-reports"
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    >
                      Most Booked Sites
                    </Link>
                  )}
                  {(isHOS ||
                    isGM ||
                    isAdmin ||
                    isHOL ||
                    isAnalyst ||
                    isOperations) && (
                    <Link
                      to="/marketers-feedback-reports"
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    >
                      Marketers Feedback
                    </Link>
                  )}
                  {(isHOS ||
                    isGM ||
                    isAdmin ||
                    isHOL ||
                    isAnalyst ||
                    isOperations) && (
                    <Link
                      to="/driver-itinerary"
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    >
                      Driver Itinerary
                    </Link>
                  )}
                </div>
              </div>
            )}
            {/* Site Visit */}
            {(isMarketer || isHOS || isGM || isAdmin || isDriver || isHOL) && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">
                  Site Visits{" "}
                  {(isAdmin || isHOL) && (
                    <span
                      className={`badge badge-warning badge-sm text-white font-bold ${
                        hasPendingSiteVisits ? "" : "hidden"
                      }`}
                    >
                      {numPendingSiteVisits}
                    </span>
                  )}
                  {(isDriver || isAdmin) && (
                    <span
                      className={`badge badge-primary badge-sm text-white font-bold ${
                        numAssignedSiteVisits > 0 ? "" : "hidden"
                      }`}
                    >
                      {numAssignedSiteVisits}
                    </span>
                  )}
                </div>
                <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                  {(isMarketer || isAdmin) && (
                    <Link
                      to={
                        !hasActiveSiteVisit && !shouldDisableSiteVisitButton()
                          ? "/book-site-visit"
                          : "#"
                      }
                      className={`font-sans mt-1 hover:bg-base-200 rounded p-2 ${
                        hasActiveSiteVisit && shouldDisableSiteVisitButton()
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`} // Add conditional styling to indicate that the link is disabled
                    >
                      Book a Site Visit
                    </Link>
                  )}
                  {(isMarketer || isAdmin) && (
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/my-site-visits"
                    >
                      My Site Visits
                    </Link>
                  )}
                  {(isDriver || isAdmin) && (
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/assigned-site-visits"
                    >
                      Assigned Site Visits{" "}
                      {(isDriver || isAdmin) && (
                        <span
                          className={`badge badge-sm badge-primary text-white font-bold ${
                            Array.isArray(assignedBookings.assignedVisits) &&
                            assignedBookings.assignedVisits.length > 0
                              ? ""
                              : "hidden"
                          }`}
                        >
                          {Array.isArray(assignedBookings.assignedVisits)
                            ? assignedBookings.assignedVisits.length
                            : 0}
                        </span>
                      )}
                    </Link>
                  )}
                  {(isHOS || isGM || isAdmin || isOperations || isHOL) && (
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/approved-site-visits"
                    >
                      Approved Site Visits
                    </Link>
                  )}
                  {(isAdmin || isHOL) && (
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/site-visit-requests"
                    >
                      Site Visit Requests{" "}
                      {(isAdmin || isHOL) && (
                        <span
                          className={`badge badge-sm badge-warning text-white font-bold ${
                            hasPendingSiteVisits ? "" : "hidden"
                          }`}
                        >
                          {numPendingSiteVisits}
                        </span>
                      )}
                    </Link>
                  )}
                  {(isHOS || isGM || isAdmin || isOperations || isHOL) && (
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/all-site-visits"
                    >
                      All Site Visit Bookings
                    </Link>
                  )}
                </div>
              </div>
            )}
            {/* Sites */}
            {(isAdmin || isOperations || isHOL || isAnalyst) && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Sites</div>
                <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/view-sites"
                  >
                    View Sites
                  </Link>
                </div>
              </div>
            )}
            {/* Vehicles */}
            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-bold">
                Vehicles{" "}
                {(isAdmin || isHOL) && (
                  <span
                    className={`badge badge-warning badge-sm text-white font-bold ${
                      hasPendingVehicleRequests ? "" : "hidden"
                    }`}
                  >
                    {numPendingVehicleRequests}
                  </span>
                )}
              </div>
              <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                <Link
                  to="/request-vehicle"
                  className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                >
                  Request For A Vehicle
                </Link>
                {(isAdmin || isHOL) && (
                  <Link
                    to="/vehicle-requests"
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                  >
                    Vehicle Requests{" "}
                    {(isAdmin || isHOL) && (
                      <span
                        className={`badge badge-sm badge-warning text-white font-bold ${
                          hasPendingVehicleRequests ? "" : "hidden"
                        }`}
                      >
                        {numPendingVehicleRequests}
                      </span>
                    )}
                  </Link>
                )}
                <Link
                  to="/past-vehicle-requests"
                  className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                >
                  My Past Vehicle Requests
                </Link>
                {(isAdmin || isOperations || isHOL) && (
                  <>
                    {(isAdmin || isOperations || isHOL) && (
                      <Link
                        className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                        to="/create-vehicle"
                      >
                        Add Vehicle
                      </Link>
                    )}
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/vehicles"
                    >
                      View Vehicles
                    </Link>
                  </>
                )}
                {(isAdmin || isDriver) && (
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/assigned-vehicle-requests"
                  >
                    Assigned Vehicle Requests
                  </Link>
                )}
              </div>
            </div>
            {/* Special Assignments */}
            {(isAdmin || isHOL || isDriver) && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">
                  Special Assignments
                </div>
                <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                  {(isHOL || isAdmin) && (
                    <>
                      <Link
                        className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                        to="/create-special-assignment"
                      >
                        Create Special Assignment
                      </Link>
                    </>
                  )}
                  {/* {(isHOL || isAdmin) && (
                    <>
                      <Link
                        className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                        to="/view-special-assignments"
                      >
                        View Special Assignments
                      </Link>
                    </>
                  )} */}
                  {(isDriver || isAdmin) && (
                    <>
                      <Link
                        className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                        to="/assigned-special-assignments"
                      >
                        Assigned Special Assignments
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
            {/* Clients */}
            {(isMarketer ||
              isHOS ||
              isGM ||
              isAdmin ||
              isHOL ||
              isOperations ||
              isAnalyst) && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Clients</div>
                <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                  {(isMarketer || isAdmin) && (
                    <>
                      <Link
                        className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                        to="/my-clients-contacts"
                      >
                        My Clients' Contacts
                      </Link>
                    </>
                  )}
                  {(isHOS ||
                    isGM ||
                    isAdmin ||
                    isHOL ||
                    isOperations ||
                    isAnalyst) && (
                    <>
                      <Link
                        className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                        to="/all-clients-contacts"
                      >
                        All Clients' Contacts
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
            {/* Drivers */}
            {(isAdmin || isHOL || isOperations) && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Drivers</div>
                <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/drivers"
                  >
                    View Drivers
                  </Link>
                </div>
              </div>
            )}
            {/* Users */}
            {(isAdmin || isHOL) && (
              <li>
                <Link to="/users" className="font-bold my-1">
                  Users
                </Link>
              </li>
            )}
            {/* Feedback */}
            <li>
              <Link to="/feedback" className="font-bold my-1">
                System Feedback
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
