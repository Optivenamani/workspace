import React, { useEffect, useState } from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryPie,
  VictoryTooltip,
  VictoryGroup,
  VictoryLine,
} from "victory";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";

const CustomLabel = ({ text, x, y, style }) => {
  return (
    <p x={x} y={y} textAnchor="middle" style={style}>
      {text}
    </p>
  );
};

const Dashboard = () => {
  // State to hold the site visits data
  const [sitesData, setSitesData] = useState([]);
  // State to hold the vehicle requests data
  const [vehicleRequests, setVehicleRequests] = useState([]);
  // State to hold the loading state
  const [isLoading, setIsLoading] = useState(true);
  // Fetching token from redux state
  const token = useSelector((state) => state.user.token);

  // Fetching site visits/ VRs data on initial render and whenever token changes
  useEffect(() => {
    // Function to fetch site visits
    const fetchSiteVisits = async () => {
      setIsLoading(true); // Set loading state to true before fetching data
      try {
        // Making GET request to fetch site visits data
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/site-visit-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Parsing response to JSON
        const data = await response.json();
        // Updating state with fetched data
        setSitesData(data);
      } catch (error) {
        // Logging error in case of failure
        console.error("Error fetching site visits:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching data
      }
    };

    // Function to fetch vehicle requests
    const fetchVehicleRequests = async () => {
      setIsLoading(true); // Set loading state to true before fetching data
      try {
        // Making GET request to fetch vehicle requests data
        const response = await fetch(
          "https://workspace.optiven.co.ke/api/vehicle-requests/all-vehicle-requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Parsing response to JSON
        const data = await response.json();
        // Updating state with fetched data
        setVehicleRequests(data);
        console.log(data);
      } catch (error) {
        // Logging error in case of failure
        console.error("Error fetching vehicle requests:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching data
      }
    };

    // Call the function to fetch site visits
    fetchSiteVisits();
    // Call the function to fetch vehicle requests
    fetchVehicleRequests();
  }, [token]);

  const countVisits = () => {
    // Create an object to hold the count for each site
    const counts = {};
    // Iterate over the sitesData array and increment the count for each site
    sitesData.forEach((site) => {
      if (site.site_name in counts) {
        counts[site.site_name]++;
      } else {
        counts[site.site_name] = 1;
      }
    });
    // Create an array of objects with the site names and their respective counts
    const countsArray = Object.entries(counts).map(([site_name, count]) => ({
      site_name,
      count,
    }));

    // Sort the countsArray from most visited to least visited
    countsArray.sort((a, b) => b.count - a.count);

    // Slice the array to keep only the top 5 most visited sites
    const top5CountsArray = countsArray.slice(0, 5);

    // Return the top 5 sorted counts array
    return top5CountsArray;
  };

  const siteCounts = countVisits();

  const maxVisits = Math.max(...siteCounts.map((site) => site.count));

  const countVisitsPerDay = () => {
    const counts = {};
    sitesData.forEach((visit) => {
      if (visit.pickup_date) {
        const date = visit.pickup_date.split("T")[0];
        if (date in counts) {
          counts[date]++;
        } else {
          counts[date] = 1;
        }
      }
    });

    // Sort the counts by date
    const sortedCounts = Object.entries(counts).sort(
      ([dateA], [dateB]) => Date.parse(dateA) - Date.parse(dateB)
    );

    // Take the last 10 items from the sortedCounts array
    const last10Counts = sortedCounts.slice(-10);

    // Create an array of objects with x and y properties for VictoryBar
    const data = last10Counts.map(([date, count]) => ({ x: date, y: count }));

    return data;
  };

  const data = countVisitsPerDay();

  if (isLoading) {
    // Render loading state if isLoading is true
    return (
      <div className="font-sans flex justify-center items-center mt-20 italic text-3xl">
        Loading...
      </div>
    );
  } else {
    // Render your charts if isLoading is false and data is fetched successfully

    return (
      <>
        <Sidebar>
          <section className="text-gray-600 body-font bg-base-200 min-h-screen pb-10">
            <div className="container px-5 py-10 mx-auto">
              <div className="flex flex-wrap -m-0">
                <div className="xl:w-1/3 md:w-1/2 p-4">
                  <div className="card w-full bg-base-100 shadow-xl">
                    <div className="m-4">
                      <CustomLabel
                        text="Most Booked Sites"
                        x={30}
                        y={30}
                        style={{ fontSize: 20, textAlign: "center" }}
                      />
                    </div>
                    <VictoryPie
                      data={siteCounts}
                      x="site_name"
                      y="count"
                      colorScale={"qualitative"}
                      // labelRadius={({ innerRadius }) => innerRadius + 30}
                      // labels={({ datum }) => `${datum.site_name}: ${datum.count}`}
                      animate={{
                        onLoad: { duration: 1000 },
                      }}
                      labelComponent={<VictoryTooltip />}
                      // padAngle={({ datum }) => datum.count}
                    />
                  </div>
                </div>
                <div className="xl:w-1/3 md:w-1/2 p-4">
                  <div className="card w-full bg-base-100 shadow-xl">
                    <div className="m-4">
                      <CustomLabel
                        text="Most Booked Sites"
                        x={30}
                        y={30}
                        style={{ fontSize: 20, textAlign: "center" }}
                      />
                    </div>
                    <VictoryChart
                      theme={VictoryTheme.material}
                      domainPadding={10}
                      animate={{ duration: 1000 }}
                    >
                      <VictoryAxis
                        tickValues={siteCounts.map((site, index) => index)}
                        tickFormat={siteCounts.map((site) => site.site_name)}
                        style={{
                          tickLabels: {
                            angle: -15,
                            textAnchor: "end",
                            fontSize: 7,
                          },
                        }}
                      />
                      <VictoryAxis
                        dependentAxis
                        tickValues={Array.from(
                          { length: maxVisits + 1 },
                          (_, index) => index
                        )}
                        tickCount={5}
                      />
                      <VictoryBar
                        data={siteCounts}
                        x="site_name"
                        y="count"
                        labels={({ datum }) => `${datum.count}`}
                        labelComponent={<VictoryTooltip />}
                        animate={{
                          duration: 2000,
                          onLoad: { duration: 1000 },
                        }}
                      />
                    </VictoryChart>
                  </div>
                </div>
                <div className="xl:w-1/3 md:w-1/2 p-4">
                  <div className="card w-full bg-base-100 shadow-xl">
                    <div className="m-4">
                      <CustomLabel
                        text="Total Site Visit Requests"
                        x={30}
                        y={30}
                        style={{ fontSize: 20, textAlign: "center" }}
                      />
                      <div className="font-bold text-7xl text-center">
                        {sitesData.length}
                      </div>
                    </div>
                  </div>
                  <div className="card w-full bg-base-100 shadow-xl mt-6">
                    <div className="m-4">
                      <CustomLabel
                        text="Total Completed Site Visits"
                        x={30}
                        y={30}
                        style={{ fontSize: 20, textAlign: "center" }}
                      />
                      <div className="font-bold text-7xl text-center">
                        {
                          sitesData.filter(
                            (sv) =>
                              sv.status === "complete" ||
                              sv.status === "reviewed"
                          ).length
                        }
                      </div>
                    </div>
                  </div>
                  <div className="card w-full bg-base-100 shadow-xl mt-5">
                    <div className="m-4">
                      <CustomLabel
                        text="Total Rejected and Cancelled Site Visits"
                        x={30}
                        y={30}
                        style={{ fontSize: 17.5, textAlign: "center" }}
                      />
                      <div className="font-bold text-7xl text-center">
                        {
                          sitesData.filter(
                            (sv) =>
                              sv.status === "rejected" ||
                              sv.status === "cancelled"
                          ).length
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="xl:w-full p-4">
                  <div
                    className="card w-full bg-base-100 shadow-xl"
                    style={{ height: "400px" }}
                  >
                    <div className="m-4">
                      <CustomLabel
                        text="Site Visits per Day for the Last 10 Site Visit Days"
                        x={30}
                        y={30}
                        style={{ fontSize: 20, textAlign: "center" }}
                      />
                    </div>
                    <VictoryChart
                      theme={VictoryTheme.material}
                      width={window.innerWidth}
                      domainPadding={50}
                    >
                      <VictoryGroup offset={20} colorScale={"qualitative"}>
                        <VictoryBar
                          data={data}
                          labels={({ datum }) => `${datum.y}`}
                          labelComponent={<VictoryTooltip />}
                        />
                      </VictoryGroup>
                      <VictoryAxis />
                      <VictoryAxis dependentAxis />
                    </VictoryChart>
                  </div>
                </div>
                <div className="xl:w-1/3 md:w-1/2 p-4">
                  <div className="card w-full bg-base-100 shadow-xl">
                    <div className="m-4">
                      <CustomLabel
                        text="Total Vehicle Requests"
                        x={30}
                        y={30}
                        style={{ fontSize: 20, textAlign: "center" }}
                      />
                      <div className="font-bold text-7xl text-center">
                        {vehicleRequests.length}
                      </div>
                    </div>
                  </div>
                  <div className="card w-full bg-base-100 shadow-xl mt-6">
                    <div className="m-4">
                      <CustomLabel
                        text="Total Completed Vehicle Requests"
                        x={30}
                        y={30}
                        style={{ fontSize: 20, textAlign: "center" }}
                      />
                      <div className="font-bold text-7xl text-center">
                        {
                          vehicleRequests.filter(
                            (vr) => vr.status === "completed"
                          ).length
                        }
                      </div>
                    </div>
                  </div>
                  <div className="card w-full bg-base-100 shadow-xl mt-5">
                    <div className="m-4">
                      <CustomLabel
                        text="Total Rejected Vehicle Requests"
                        x={30}
                        y={30}
                        style={{ fontSize: 17.5, textAlign: "center" }}
                      />
                      <div className="font-bold text-7xl text-center">
                        {
                          vehicleRequests.filter(
                            (vr) => vr.status === "rejected"
                          ).length
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="xl:w-2/3 md:w-full p-4">
                  <div
                    className="card w-full bg-base-100 shadow-xl"
                    style={{ height: "435px" }}
                  >
                    <div className="m-4">
                      <CustomLabel
                        text="Site Visits Booking Trends"
                        x={30}
                        y={30}
                        style={{ fontSize: 20, textAlign: "center" }}
                      />
                    </div>
                    <VictoryChart
                      theme={VictoryTheme.material}
                      width={window.innerWidth}
                      domainPadding={{ x: 0, y: 5 }}
                    >
                      <VictoryGroup offset={20} colorScale={"qualitative"}>
                        <VictoryLine
                          data={data}
                          labels={({ datum }) => `${datum.y}`}
                          labelComponent={<VictoryTooltip />}
                        />
                      </VictoryGroup>
                      <VictoryAxis />
                      <VictoryAxis dependentAxis />
                    </VictoryChart>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Sidebar>
      </>
    );
  }
};

export default Dashboard;
