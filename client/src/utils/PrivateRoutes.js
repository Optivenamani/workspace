import { Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// components
import Navbar from "../logistics/components/navbar/Navbar";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  if (!token) {
    return <Navigate to="/login" />;
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
