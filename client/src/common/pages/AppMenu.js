import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AppMenu = ({ onAppSelect }) => {
  const handleAppSelect = (appName, event) => {
    onAppSelect(appName);
  };

  const department = useSelector((state) => state.user.user.department);
  const accessRole = useSelector((state) => state.user.user.Accessrole);

  return (
    <>
      <section className="min-h-screen">
        <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
          <ul className="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3">
            <li>
              <Link
                to="/logistics-home"
                className="block overflow-hidden group"
                onClick={() => handleAppSelect("Logistics")}
              >
                <img
                  src={require("../../assets/media/home.jpg")}
                  alt=""
                  className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                />
                <div className="relative pt-3 bg-white">
                  <h3 className="text-sm text-gray-700 group-hover:underline group-hover:underline-offset-4">
                    Logistics
                  </h3>
                </div>
              </Link>
            </li>
            {department === "ICT (S)" && (
              <li>
                <Link
                  to="/workplan-home"
                  className="block overflow-hidden group"
                  onClick={handleAppSelect}
                >
                  <img
                    src="https://images.unsplash.com/photo-1603899607191-e9425cdfdd7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80"
                    alt=""
                    className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                  />
                  <div className="relative pt-3 bg-white">
                    <h3 className="text-sm text-gray-700 group-hover:underline group-hover:underline-offset-4">
                      Workplan
                    </h3>
                  </div>
                </Link>
              </li>
            )}
            {(department === "ICT (S)" ||
              department === "Customer Exp" ||
              accessRole === "visitorsManagementHR") && (
              <li>
                <Link
                  to="/visitors-management"
                  className="block overflow-hidden group"
                  onClick={() => handleAppSelect("Visitor Management")}
                >
                  <img
                    src="https://images.unsplash.com/photo-1559056961-1f4dbbf9d36a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
                    alt=""
                    className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                  />
                  <div className="relative pt-3 bg-white">
                    <h3 className="text-sm text-gray-700 group-hover:underline group-hover:underline-offset-4">
                      Visitors Management
                    </h3>
                  </div>
                </Link>
              </li>
            )}
            {department === "ICT (S)" && (
              <li>
                <Link
                  to="/view-feedback"
                  className="block overflow-hidden group"
                  onClick={() => handleAppSelect("Visitor Management")}
                >
                  <img
                    src="https://images.pexels.com/photos/6610213/pexels-photo-6610213.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt=""
                    className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                  />
                  <div className="relative pt-3 bg-white">
                    <h3 className="text-sm text-gray-700 group-hover:underline group-hover:underline-offset-4">
                      Feedback
                    </h3>
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </section>
    </>
  );
};

export default AppMenu;
