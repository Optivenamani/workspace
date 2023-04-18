import { Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// components
import Navbar from "../components/navbar/Navbar";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  return token ? (
    <>
      <Navbar
        fullName={user.fullnames || "Undefined"}
        email={user.email || "Undefined"}
      />
      <ToastContainer />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
