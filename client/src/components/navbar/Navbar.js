import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// assets
import logo from "../../assets/optiven-logo-full.png";
import userAvatar from "../../assets/gifs/user.gif";
// css
import "./styles/Navbar.css";
// redux
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/user/userSlice";

const Navbar = ({ fullName, email }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notifications, status } = useSelector(
    (state) => state.notifications.notifications
  );

  useEffect(() => {
    if (status === "succeeded") {
      const unread = notifications.filter(
        (notification) => notification.isRead === 0
      ).length;
      setUnreadCount(unread);
    }
  }, [notifications, status]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/login");
  };

  console.log("status", status);
  console.log("unreadCount", unreadCount);

  return (
    <div className="navbar bg-primary">
      <div className="flex-1">
        <div
          className="tooltip tooltip-right"
          data-tip="Click to toggle drawer"
        >
          <label
            htmlFor="my-drawer"
            className="drawer-button cursor-pointer btn btn-square btn-ghost hover:bg-green-600"
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
        <Link className="btn btn-ghost normal-case text-xl" to="/">
          <img src={logo} alt="logo" className="w-40" />
        </Link>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div className="flex items-center">
            <div className="text-end mr-2 content-center hide-on-mobile text-white">
              <h1 className="font-bold text-sm">{fullName}</h1>
              <p className="text-xs italic">{email}</p>
            </div>
            <label
              tabIndex={0}
              className="mr-2 mt-1 btn btn-ghost btn-circle avatar indicator"
            >
              <div className="w-10 rounded-full">
                <img alt="user" src={userAvatar} />
                {unreadCount > 0 && status === "succeeded" && (
                  <span className="h-5 w-5 rounded-3xl badge badge-xs badge-neutral indicator-item">
                    {unreadCount}
                  </span>
                )}
              </div>
            </label>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link className="justify-between" to="/notifications">
                Notifications
                <span
                  className={`badge badge-sm badge-neutral h-5 w-5 rounded-3xl font-bold ${
                    unreadCount === 0 ? "hidden" : ""
                  }`}
                >
                  {unreadCount}
                </span>
              </Link>
            </li>
            <li>
              <Link>Change Password</Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 hover:bg-gray-200"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
