import { Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// components
import Navbar from "../logistics/components/navbar/Navbar";
import { useState } from "react";
import AppMenu from "../common/pages/AppMenu";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [selectedApp, setSelectedApp] = useState(false);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!selectedApp) {
    return <AppMenu onAppSelect={() => setSelectedApp(true)} />;
  }

  return (
    <>
      <Navbar
        fullName={user.fullnames || "Undefined"}
        email={user.email || "Undefined"}
      />
      <ToastContainer />
      <Outlet />
    </>
  );
};


export default PrivateRoutes;
