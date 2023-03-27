import React from "react";
import logo from "../assets/optiven-logo-full.png";
import userAvatar from "../assets/gifs/user.gif";
import "./styles/Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar bg-blue-400">
      <div className="flex-1">
        <div
          className="tooltip tooltip-right"
          data-tip="Click to toggle drawer"
        >
          <label
            htmlFor="my-drawer"
            className="drawer-button cursor-pointer btn btn-square btn-ghost hover:bg-blue-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </label>
        </div>
        <a className="btn btn-ghost normal-case text-xl" href="/">
          <img src={logo} alt="logo" className="w-40" />
        </a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div className="flex items-center">
            <div className="text-end mr-2 content-center hide-on-mobile text-white">
              <h1 className="font-bold text-sm">John Smith</h1>
              <p className="text-xs italic">Convertor</p>
            </div>
            <label
              tabIndex={0}
              className="mr-5 mt-1 btn btn-ghost btn-circle avatar indicator"
            >
              <div className="w-10 rounded-full">
                <img alt="user" src={userAvatar} />
                {(1+1===2) && <span className="h-5 w-5 rounded-3xl badge badge-xs badge-primary indicator-item">
                  3
                </span>}
              </div>
            </label>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <div className="justify-between">
                Notifications
                {(1+1===2) && <span className="badge badge-sm badge-primary h-5 w-5 rounded-3xl">3</span>}
              </div>
            </li>
            <li>
              <a>Change Password</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
