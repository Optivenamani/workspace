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
  const [mostProlificTasks, setMostProlificTasks] = useState([]);
  const [maxProlificCount, setMaxProlificCount] = useState(0); // New state for max prolific count
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

        // Fetch the most prolific tasks
        const responseTasks = await fetch(
          `http://localhost:8080/api/workplan-activities/most-prolific-activities?limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const tasksData = await responseTasks.json();
        setMostProlificTasks(tasksData);

        // Calculate the maximum prolific count
        const maxCount = Math.max(
          ...tasksData.map((task) => task.activity_count)
        );
        setMaxProlificCount(maxCount);
      } catch (error) {
        // Logging error in case of failure
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after fetching data
      }
    };
    // Call the function to fetch data
    fetchactiveMarketers();
  }, [token]);

  // Calculate the total count of activities for percentage calculation
  const totalActivityCount = activeMarketers.reduce(
    (total, activity) => total + activity.activity_count,
    0
  );

  const sortedActiveMarketers = activeMarketers.sort(
    (a, b) => a.activity_count - b.activity_count
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                  domain={[
                    0,
                    Math.max(
                      ...activeMarketers.map(
                        (activity) => activity.activity_count
                      )
                    ),
                  ]}
                  style={{
                    tickLabels: {
                      angle: -15,
                      textAnchor: "end",
                      fontSize: 5,
                    },
                  }}
                />
                <VictoryAxis dependentAxis />
                <VictoryBar
                  data={sortedActiveMarketers}
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
          {/* Code for displaying most prolific tasks as a bar graph */}
          <div className="p-4">
            <div className="card w-full bg-base-100 shadow-xl">
              <div className="m-4">
                <CustomLabel
                  text={`Top ${limit} Most Prolific Tasks in the Past Week`}
                  x={30}
                  y={30}
                  style={{ fontSize: 15, textAlign: "center" }}
                />
              </div>
              <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
                <VictoryAxis
                  tickValues={mostProlificTasks.map((task) => task.title)}
                  tickFormat={mostProlificTasks.map((task) => task.title)}
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
                  tickValues={Array.from(
                    { length: Math.ceil(maxProlificCount) + 1 },
                    (_, i) => i
                  )}
                />
                <VictoryBar
                  data={mostProlificTasks}
                  x="title"
                  y="activity_count"
                  labels={({ datum }) => `${datum.activity_count}`}
                  labelComponent={<VictoryTooltip />}
                />
              </VictoryChart>
            </div>
          </div>
        </div>
      </Sidebar>
    );
  }
};

export default WorkPlanDashboard;
