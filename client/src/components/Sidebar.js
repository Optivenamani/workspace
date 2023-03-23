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
                Dashboard
              </a>
            </li>
            <div className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box my-1">
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-bold">Bookings</div>
              <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                <a
                  href="/create-project"
                  className="font-medium mt-1 hover:bg-base-300 rounded-3xl p-2"
                >
                  Create Project
                </a>
                <a
                  className="font-medium mt-3 hover:bg-base-300 rounded-3xl p-2"
                  href="/projects"
                >
                  View Projects
                </a>
              </div>
            </div>
            <div className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box my-1">
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-bold">Suppliers</div>
              <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                <a
                  className="font-medium mt-1 hover:bg-base-300 rounded-3xl p-2"
                  href="/add-supplier"
                >
                  Add Supplier
                </a>
                <a
                  className="font-medium mt-3 hover:bg-base-300 rounded-3xl p-2"
                  href="/suppliers"
                >
                  View Suppliers
                </a>
              </div>
            </div>
            <div className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box my-1">
              <input type="checkbox" className="peer" />
              <div className="collapse-title font-bold">Labour</div>
              <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                <div className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box my-1">
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title font-bold">Job Groups</div>
                  <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                    <a
                      className="font-medium mt-1 hover:bg-base-300 rounded-3xl p-2"
                      href="/add-job-group"
                    >
                      Add Job Group
                    </a>
                    <a
                      className="font-medium mt-3 hover:bg-base-300 rounded-3xl p-2"
                      href="/view-job-groups"
                    >
                      View Job Groups
                    </a>
                  </div>
                </div>
                <div className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box my-1">
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title font-bold">Staff</div>
                  <div className="collapse-content -mt-3 flex flex-col menu bg-base-100">
                    <a
                      className="font-medium mt-1 hover:bg-base-300 rounded-3xl p-2"
                      href="/add-staff"
                    >
                      Add Staff
                    </a>
                    <a
                      className="font-medium mt-3 hover:bg-base-300 rounded-3xl p-2"
                      href="/view-staff"
                    >
                      View Staff
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* for other links, li>Link */}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
