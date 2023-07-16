import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = ({ children }) => {
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
                </>
                <>
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/view-workplans"
                  >
                    View Work Plans
                  </Link>
                </>
              </div>
            </div>
            {/* Tasks */}
            <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-bold">Activities</div>
              <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
                <>
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/view-activities"
                  >
                    View Activities
                  </Link>
                </>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
