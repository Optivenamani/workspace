import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = ({ children }) => {
  const accessRole = useSelector((state) => state.user.accessRole).trim();

  const department = useSelector((state) => state.user.user.department);

  const accessRoles = accessRole.split("#");

  const isCustomerExp = accessRoles.includes("isCustomerExp");
  const isVisitorsManagementHR = accessRoles.includes("visitorsManagementHR");

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
              <Link to="/foundation-home" className="font-bold my-1">
                Home
              </Link>
            </li>

            {/* Pillars */}
            {(isCustomerExp || department === "ICT (S)") && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Pillars</div>
                <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/education"
                  >
                    Education
                  </Link>
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/health"
                  >
                    Health
                  </Link>
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/environment"
                  >
                    Environment
                  </Link>
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/poverty-alleviation"
                  >
                    Poverty Alleviation
                  </Link>
                </div>
              </div>
            )}

            {/* Books */}
            {(isCustomerExp ||
              isVisitorsManagementHR ||
              department === "ICT (S)") && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Books</div>
                <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
                  {(isVisitorsManagementHR || department === "ICT (S)") && (
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/schedule-interview"
                    >
                      Schedule Interview
                    </Link>
                  )}
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/view-interviews"
                  >
                    View Interviews
                  </Link>
                </div>
              </div>
            )}

            {/* Donors */}
            {(isCustomerExp ||
              isVisitorsManagementHR ||
              department === "ICT (S)") && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Donors</div>
                <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/visitors-reports"
                  >
                    Visitors Reports
                  </Link>
                  {(isVisitorsManagementHR || department === "ICT (S)") && (
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/interviews-reports"
                    >
                      Interview Reports
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Events */}
            {(isCustomerExp ||
              isVisitorsManagementHR ||
              department === "ICT (S)") && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Events</div>
                <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/visitors-reports"
                  >
                    All Events
                  </Link>
                </div>
              </div>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
