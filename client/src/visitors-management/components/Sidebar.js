import React from "react";
import { useSelector } from "react-redux";
import "./Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = ({ children }) => {
  const accessRole = useSelector((state) => state.user.accessRole);
  const isAdmin =
    accessRole === `112#700#117#116` ||
    accessRole === `112#305#117#116#113#770` ||
    accessRole === `112#114#700`;

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
              <Link to="/visitors-management" className="font-bold my-1">
                Home
              </Link>
            </li>
            {/* Clients */}
            {isAdmin && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Visitors</div>
                <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
                  {isAdmin && (
                    <>
                      <Link
                        className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                        to="/register-visitor"
                      >
                        Register Visitor
                      </Link>
                    </>
                  )}
                  {isAdmin && (
                    <>
                      <Link
                        className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                        to="/view-visitors"
                      >
                        View Visitors
                      </Link>
                    </>
                  )}
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
