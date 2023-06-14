import React from "react";
import { Link } from "react-router-dom";

const AppMenu = ({ onAppSelect }) => {
  const handleAppSelect = (appName, event) => {
    onAppSelect(appName);
  };

  return (
    <>
      <section className="min-h-screen">
        <div className="max-w-screen-xl px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
          <ul className="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-4">
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
            <li>
              <Link
                // to="#"
                className="block overflow-hidden group"
                onClick={handleAppSelect}
              >
                <img
                  src="https://images.pexels.com/photos/7564257/pexels-photo-7564257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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
            <li>
              <Link
                // to="#"
                className="block overflow-hidden group"
                onClick={() => handleAppSelect("Visitor Management")}
              >
                <img
                  src="https://images.pexels.com/photos/7564257/pexels-photo-7564257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
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
            <li>
              <Link
                to="#"
                className="block overflow-hidden group"
                onClick={handleAppSelect}
              >
                <img
                  src="https://images.pexels.com/photos/7564257/pexels-photo-7564257.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt=""
                  className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                />
                <div className="relative pt-3 bg-white">
                  <h3 className="text-sm text-gray-700 group-hover:underline group-hover:underline-offset-4">
                    Coming Soon
                  </h3>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default AppMenu;
