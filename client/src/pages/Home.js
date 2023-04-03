import React from "react";
import Sidebar from "../components/Sidebar";
import logo from "../assets/optiven-logo-full.png";

const Home = () => {
  return (
    <>
      <Sidebar>
        <div className="flex justify-center items-center mt-32">
          <div className="mockup-window border bg-base-300 w-1/2">
            <div className="flex justify-center px-4 py-16 bg-base-100">
              <img src={logo} alt="logo" className="z-10" />
            </div>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default Home;
