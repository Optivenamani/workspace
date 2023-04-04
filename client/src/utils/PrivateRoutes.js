import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
// components
import Navbar from "../components/navbar/Navbar";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  return token ? (
    <>
      <Navbar
        fullName={user.fullnames || "Undefined"}
        department={user.department || "Undefined"}
      />
      <ToastContainer />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
