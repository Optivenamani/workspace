import React, { useEffect, useState } from "react";
import MapComponent from "./components/MapComponent";
import geojsonData from "./geojsonData/JLClub";
import Legend from "./components/Legend";
import { Link } from "react-router-dom";
import logo from "../../src/assets/optiven-logo-full.png";

const JoyLovers = () => {
  const [plotUnitsData, setplotUnitsData] = useState([]);

  useEffect(() => {
    // Fetch plot data from the backend when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/plots");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched plot data:", data);
          setplotUnitsData(data);
        } else {
          console.error("Failed to fetch plot data");
        }
      } catch (error) {
        console.error("Error fetching plot data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="navbar bg-primary">
        <Link className="btn btn-ghost normal-case text-xl" to="#">
          <img src={logo} alt="logo" className="w-40" />
        </Link>
      </div>
      <div className="JoyLovers">
        <div className="header">
          <h1>
            <b>JOY LOVERS CLUB - MALINDI</b>
          </h1>
        </div>
        <MapComponent geojsonData={geojsonData} plotUnitsData={plotUnitsData} />
        <Legend />
      </div>
    </>
  );
};

export default JoyLovers;
