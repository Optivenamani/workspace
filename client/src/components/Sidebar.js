import React from "react";

const Sidebar = ({ children }) => {
  return (
    <>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content overflow-visible">{children}</div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            <li>
              <a href="/" className="font-bold my-1">
                Home
              </a>
            </li>
            <li>
              <a href="/dashboard" className="font-bold my-1">
                Dashboard
              </a>
            </li>
            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-bold">Site Visits</div>
              <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                <a
                  href="/create-booking"
                  className="font-medium mt-1 hover:bg-base-200 rounded p-2"
                >
                  Book a Site Visit
                </a>
                <a
                  className="font-medium mt-3 hover:bg-base-200 rounded p-2"
                  href="/my-bookings"
                >
                  My Site Visits
                </a>
                <a
                  className="font-medium mt-3 hover:bg-base-200 rounded p-2"
                  href="/assigned-bookings"
                >
                  Assigned Site Visits
                </a>
                <a
                  className="font-medium mt-3 hover:bg-base-200 rounded p-2"
                  href="/approved-bookings"
                >
                  Approved Site Visits
                </a>
                <a
                  className="font-medium mt-3 hover:bg-base-200 rounded p-2"
                  href="/bookings-requests"
                >
                  Site Visit Requests
                </a>
                <a
                  className="font-medium mt-3 hover:bg-base-200 rounded p-2"
                  href="/all-bookings"
                >
                  All Site Visit Bookings
                </a>
              </div>
            </div>
            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-bold">Sites</div>
              <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                <a
                  className="font-medium mt-1 hover:bg-base-200 rounded p-2"
                  href="/create-site"
                >
                  Create Site
                </a>
                <a
                  className="font-medium mt-3 hover:bg-base-200 rounded p-2"
                  href="/view-sites"
                >
                  View Sites
                </a>
              </div>
            </div>
            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-bold">Vehicles</div>
              <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                <a
                  className="font-medium mt-1 hover:bg-base-200 rounded p-2"
                  href="/create-vehicle"
                >
                  Add Vehicle
                </a>
                <a
                  className="font-medium mt-3 hover:bg-base-200 rounded p-2"
                  href="/view-vehicles"
                >
                  View Vehicles
                </a>
                <a
                  href="/request-vehicle"
                  className="font-medium mt-3 hover:bg-base-200 rounded p-2"
                >
                  Request Vehicle
                </a>
              </div>
            </div>
            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-bold">Clients</div>
              <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                <a
                  className="font-medium mt-1 hover:bg-base-200 rounded p-2"
                  href="/clients-contacts"
                >
                  Clients Contacts
                </a>
                <a
                  className="font-medium mt-3 hover:bg-base-200 rounded p-2"
                  href="/clients-feedback"
                >
                  Clients Feedback
                </a>
              </div>
            </div>
            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-bold">Drivers</div>
              <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                <a
                  className="font-medium mt-1 hover:bg-base-200 rounded p-2"
                  href="/create-driver"
                >
                  Add Driver
                </a>
                <a
                  className="font-medium mt-3 hover:bg-base-200 rounded p-2"
                  href="/view-drivers"
                >
                  View Drivers
                </a>
              </div>
            </div>

            <li>
              <a href="/users" className="font-bold my-1">
                Users
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
