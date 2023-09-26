import React, { useEffect, useState } from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryTooltip,
  VictoryPie,
} from "victory";
import { useSelector } from "react-redux";

import Sidebar from "../components/Sidebar";

const CustomLabel = ({ text, x, y, style }) => {
  return (
    <p x={x} y={y} textAnchor="middle" style={style}>
      {text}
    </p>
  );
};

const WorkPlanDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeMarketers, setActiveMarketers] = useState([]);
  const [maxActivities, setMaxActivities] = useState(0);
  const token = useSelector((state) => state.user.token);
  const limit = 5;

  useEffect(() => {
    // Function to fetch prolific activities
    const fetchactiveMarketers = async () => {
      try {
        // Making GET request to fetch prolific activities data
        const response = await fetch(
          `http://localhost:8080/api/workplan-activities/most-active-marketers?limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Parsing response to JSON
        const data = await response.json();
        // Updating state with fetched data
        setActiveMarketers(data);
        // Calculate the maximum activity count within this block
        const maxActivityCount = Math.max(
          ...data.map((activity) => parseInt(activity.activity_count))
        );

        // Set the state with the maximum activity count
        setMaxActivities(maxActivityCount);
      } catch (error) {
        // Logging error in case of failure
        console.error("Error fetching prolific activities:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching data
      }
    };
    // Call the function to fetch prolific activities
    fetchactiveMarketers();
  }, [token]);

  // Calculate the total count of activities for percentage calculation
  const totalActivityCount = activeMarketers.reduce(
    (total, activity) => total + activity.activity_count,
    0
  );

  // Prepare data for the pie chart
  const pieChartData = activeMarketers.map((activity) => ({
    x: activity.marketer_name,
    y: (activity.activity_count / totalActivityCount) * 100,
  }));

  if (isLoading) {
    // Render loading state if isLoading is true
    return (
      <div className="font-sans flex justify-center items-center mt-20 italic text-3xl">
        Loading...
      </div>
    );
  } else {
    return (
      <Sidebar>
        <div className="grid grid-cols-3">
          <div className=" p-4">
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="m-4">
                <CustomLabel
                  text={`Top ${limit} Most Active Marketers in the Past Week`}
                  x={30}
                  y={30}
                  style={{ fontSize: 15, textAlign: "center" }}
                />
              </div>
              <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
                <VictoryAxis
                  tickValues={activeMarketers.map((index) => index)}
                  tickFormat={activeMarketers.map(
                    (activity) => activity.marketer_name
                  )}
                  style={{
                    tickLabels: {
                      angle: -15,
                      textAnchor: "end",
                      fontSize: 5,
                    },
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  tickValues={Array.from({ length: 0 }, (_, index) => index)}
                  tickCount={5}
                />
                <VictoryBar
                  data={activeMarketers}
                  x="marketer_name"
                  y="activity_count"
                  labels={({ datum }) => `${datum.activity_count}`}
                  labelComponent={<VictoryTooltip />}
                />
              </VictoryChart>
            </div>
          </div>
          <div className="p-4">
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="m-4">
                <CustomLabel
                  text={`Top ${limit} Marketers - Activity Distribution`}
                  x={30}
                  y={30}
                  style={{ fontSize: 15, textAlign: "center" }}
                />
              </div>
              <VictoryPie
                data={pieChartData}
                x="x"
                y="y"
                colorScale={"qualitative"}
                labelComponent={<VictoryTooltip />}
              />
            </div>
          </div>
        </div>
      </Sidebar>
    );
  }
};

export default WorkPlanDashboard;
