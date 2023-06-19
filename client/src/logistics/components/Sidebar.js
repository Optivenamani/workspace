import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchActiveSiteVisits } from "../../redux/logistics/features/siteVisit/siteVisitSlice";
import { fetchActiveVehicleRequests } from "../../redux/logistics/features/vehicleRequest/vehicleRequestSlice";
import "./Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = ({ children }) => {
  const accessRole = useSelector((state) => state.user.accessRole).trim();

  // const activeVehicleRequests = useSelector(
  //   (state) => state.vehicleRequest.activeRequests
  // );
  // const vehicleRequestStatus = useSelector(
  //   (state) => state.vehicleRequest.status
  // );

  // console.log("Active Site Visits:", activeVisits ? activeVisits.length : 'undefined');
  // console.log("Active Vehicle Requests", activeVehicleRequests ? activeVehicleRequests.length : 'undefined')

  const isMarketer = accessRole === `113`;
  const isRachel = accessRole === `113#114`;
  const isJoe = accessRole === `113#115`;
  const isDriver = accessRole === `driver69`;
  const isHOL = accessRole === `headOfLogistics`;
  const isAnalyst = accessRole === `112#420#69`;
  const isAdmin =
    accessRole === `112#700#117#116` ||
    accessRole === `112#305#117#116#113#770` ||
    accessRole === `112#114#700`;
  const isOperations =
    accessRole === `112#116#303#305` ||
    accessRole === `112#304` ||
    accessRole === `112#305`;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchActiveSiteVisits());
    dispatch(fetchActiveVehicleRequests());
  }, [dispatch]);

  // const canRequestVehicle = () => {
  //   if (vehicleRequestStatus === "loading") {
  //     return false;
  //   }

  //   if (activeVehicleRequests.length === 0) {
  //     return true;
  //   }

  //   const latestVehicleRequest = activeVehicleRequests[0];
  //   return latestVehicleRequest.state === "completed";
  // };

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
            {(isRachel ||
              isJoe ||
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
            {(isRachel ||
              isJoe ||
              isAdmin ||
              isHOL ||
              isAnalyst ||
              isOperations) && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Reports</div>
                <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                  {(isRachel ||
                    isJoe ||
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
                  {(isRachel ||
                    isJoe ||
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
                  {(isRachel ||
                    isJoe ||
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
                  {(isRachel ||
                    isJoe ||
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
                </div>
              </div>
            )}
            {/* Site Visit */}
            {(isMarketer ||
              isRachel ||
              isJoe ||
              isAdmin ||
              isDriver ||
              isHOL) && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Site Visits</div>
                <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                  {(isMarketer || isAdmin) && (
                    <Link
                      to="/book-site-visit"
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
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
                  {(isAdmin || isDriver) && (
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/assigned-site-visits"
                    >
                      Assigned Site Visits
                    </Link>
                  )}
                  {(isRachel || isJoe || isAdmin || isOperations || isHOL) && (
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
                      Site Visit Requests
                    </Link>
                  )}
                  {(isRachel || isJoe || isAdmin || isOperations || isHOL) && (
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
            {(isAdmin || isOperations || isHOL) && (
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
              <div className="collapse-title font-bold">Vehicles</div>
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
                    Vehicle Requests
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
            {/* Clients */}
            {(isMarketer ||
              isRachel ||
              isJoe ||
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
                  {(isRachel ||
                    isJoe ||
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
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
