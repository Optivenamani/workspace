import React, { useEffect, useState } from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryPie,
  VictoryTooltip,
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
  const [sitesData, setSitesData] = useState([]);
  const token = useSelector((state) => state.user.token);
  useEffect(() => {
    const fetchSiteVisits = async () => {
      try {
        const response = await fetch("http://209.38.246.14:8080/api/site-visits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setSitesData(data);
      } catch (error) {
        console.error("Error fetching site visits:", error);
      }
    };

    fetchSiteVisits();
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

  return (
    <>
      <Sidebar>
        <section className="text-gray-600 body-font bg-base-200 min-h-screen">
          <div className="container px-5 py-10 mx-auto">
            <div className="flex flex-wrap -m-0">
              <div className="xl:w-1/3 md:w-1/2 p-4">
                <div className="card w-full bg-base-100 shadow-xl">
                  <div className="m-4">
                    <CustomLabel
                      text="Most Visited Sites"
                      x={30}
                      y={30}
                      style={{ fontSize: 20 }}
                    />
                  </div>
                  <VictoryPie
                    data={siteCounts}
                    x="site_name"
                    y="count"
                    colorScale={"qualitative"}
                    innerRadius={100}
                    // labelRadius={({ innerRadius }) => innerRadius + 30}
                    // labels={({ datum }) => `${datum.site_name}: ${datum.count}`}
                    animate={{
                      onLoad: { duration: 1000 },
                    }}
                    labelComponent={<VictoryTooltip />}
                    padAngle={({ datum }) => datum.count}
                  />
                </div>
              </div>
              <div className="xl:w-1/3 md:w-1/2 p-4">
                <div className="card w-full bg-base-100 shadow-xl">
                  <div className="m-4">
                    <CustomLabel
                      text="Top 5 Most Visited Sites"
                      x={30}
                      y={30}
                      style={{ fontSize: 20 }}
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
                          angle: -10,
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
                    />
                    <VictoryBar
                      data={siteCounts}
                      // cornerRadius={{ topLeft: ({ datum }) => datum.count * 4 }}
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
            </div>
          </div>
        </section>
      </Sidebar>
    </>
  );
};

export default Dashboard;
