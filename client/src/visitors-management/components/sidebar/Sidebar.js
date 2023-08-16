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
              <Link to="/visitors-management" className="font-bold my-1">
                Home
              </Link>
            </li>

            {/* Visitors */}
            {(isCustomerExp || department === "ICT") && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Visitors</div>
                <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/register-visitor"
                  >
                    Register Visitor
                  </Link>
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/view-visitors"
                  >
                    View Visitors
                  </Link>
                </div>
              </div>
            )}

            {/* Interviews */}
            {(isCustomerExp || isVisitorsManagementHR || department === "ICT") && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Interviews</div>
                <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
                  {(isVisitorsManagementHR || department === "ICT")&& (
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

            {/* Reports */}
            {(isCustomerExp || isVisitorsManagementHR || department === "ICT") && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Reports</div>
                <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/visitors-reports"
                  >
                    Visitors Reports
                  </Link>
                  {(isVisitorsManagementHR || department === "ICT") && (
                    <Link
                      className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                      to="/interview-reports"
                    >
                      Interview Reports
                    </Link>
                  )}
                </div>
              </div>
<<<<<<< HEAD
            </div>
             {/* Meetings */}
             <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
             <input type="checkbox" className="peer" />
             <div className="collapse-title font-bold">Meetings</div>
             <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
               <Link
                 className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                 to="/schedule-meeting"
               >
                 Schedule Meeting
               </Link>
               <Link
                 className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                 to="/view-meetings"
               >
                 View Scheduled Meeting
               </Link>
             </div>
           </div>
=======
            )}

>>>>>>> a43d00e1fd45f176dcf9f55c94cee4d0abed7c0f
            {/* Parking */}
            {(isCustomerExp || department === "ICT") && (
              <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box my-1">
                <input type="checkbox" className="peer" />
                <div className="collapse-title font-bold">Parking</div>
                <div className="collapse-content -mt-5 flex flex-col menu bg-base-100">
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/reserve-parking"
                  >
                    Reserve Parking
                  </Link>
                  <Link
                    className="font-sans mt-1 hover:bg-base-200 rounded p-2"
                    to="/reserved-parking"
                  >
                    View Reserved Parking
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
