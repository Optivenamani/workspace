import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = ({ children }) => {
  const accessRole = useSelector((state) => state.user.user.Accessrole);

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
              <Link to="/workplan-home" className="font-bold my-1">
                Home
              </Link>
            </li>
            {/* Workplans */}
            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-bold">Work Plans</div>
              <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
                <>
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/create-workplan"
                  >
                    Create Work Plan
                  </Link>
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/view-workplans"
                  >
                    My Work Plans
                  </Link>
                </>
                <>
                  {(accessRole.split("#").includes("salesManager") ||
                    accessRole.split("#").includes("regionalManager") ||
                    accessRole.split("#").includes("workplanAdmin")) && (
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/approve-workplans"
                    >
                      Approve Work Plans
                    </Link>
                  )}
                </>
              </div>
            </div>
            {/* Activities */}
            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-bold">Activities</div>
              <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
                {/* <>
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/update-activities"
                  >
                    Update Activities
                  </Link>
                </> */}
                <>
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/view-activities"
                  >
                    View Activities
                  </Link>
                </>
                <>
                  {(accessRole.split("#").includes("regionalManager") ||
                    accessRole.split("#").includes("workplanAdmin")) && (
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/fill-remarks"
                    >
                      Fill Remarks
                    </Link>
                  )}
                </>
              </div>
            </div>
            {/* Reports */}
            {(accessRole.split("#").includes("regionalManager") ||
              accessRole.split("#").includes("workplanAdmin")) && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Reports</div>
                <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
                  <>
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/activity-reports"
                    >
                      Activity Reports
                    </Link>
                  </>
                  <>
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/productivity-reports"
                    >
                      Productivity Reports
                    </Link>
                  </>
                  <>
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/team-reports"
                    >
                      Region Reports
                    </Link>
                  </>
                  <>
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/individual-reports"
                    >
                      Individual Reports
                    </Link>
                  </>
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
