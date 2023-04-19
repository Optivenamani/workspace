import React, { useEffect, useState } from "react";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryPie,
  VictoryLine,
  VictoryTooltip,
  VictoryStack,
  VictoryLabel,
} from "victory";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";

const siteData = [
  { month: "Jan", visits: 250 },
  { month: "Feb", visits: 260 },
  { month: "Mar", visits: 240 },
  { month: "Apr", visits: 280 },
  { month: "May", visits: 300 },
  { month: "Jun", visits: 270 },
  { month: "Jul", visits: 260 },
  { month: "Aug", visits: 280 },
  { month: "Sep", visits: 260 },
  { month: "Oct", visits: 265 },
  { month: "Nov", visits: 280 },
  { month: "Dec", visits: 270 },
];

const propertyData = [
  [
    { quarter: 1, sales: 3000 },
    { quarter: 2, sales: 5000 },
    { quarter: 3, sales: 2500 },
    { quarter: 4, sales: 6000 },
  ],
  [
    { quarter: 1, sales: 1000 },
    { quarter: 2, sales: 1500 },
    { quarter: 3, sales: 1250 },
    { quarter: 4, sales: 3000 },
  ],
];

const Dashboard = () => {
  const [sitesData, setSitesData] = useState([]);
  const token = useSelector((state) => state.user.token);
  useEffect(() => {
    const fetchSiteVisits = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/site-visits", {
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

    // Return the sorted counts array
    return countsArray;
  };

  const siteCounts = countVisits();

  const maxVisits = Math.max(...siteCounts.map((site) => site.count));

  return (
    <>
      <Sidebar>
        <section className="text-gray-600 body-font bg-base-200 hero">
          <div className="container px-5 py-10 mx-auto">
            <div className="flex flex-wrap -m-0">
              <div className="xl:w-1/3 md:w-1/2 p-4">
                <div className="card w-full bg-base-100 shadow-xl">
                  <div className="m-4">
                    <VictoryLabel
                      text="Most Visited Sites"
                      x={30}
                      y={30}
                      textAnchor="middle"
                      style={{ fontSize: 20 }}
                    />
                  </div>
                  <VictoryPie
                    data={siteCounts}
                    x="site_name"
                    y="count"
                    colorScale={"qualitative"}
                    innerRadius={80}
                    labelRadius={({ innerRadius }) => innerRadius + 30}
                    labels={({ datum }) => `${datum.site_name}: ${datum.count}`}
                    animate={{
                      onLoad: { duration: 1000 },
                    }}
                    labelComponent={<VictoryTooltip />}
                  />
                </div>
              </div>
              <div className="xl:w-1/3 md:w-1/2 p-4">
                <div className="card w-full bg-base-100 shadow-xl">
                  <div className="m-4">
                    <VictoryLabel
                      text="Site Visits"
                      x={30}
                      y={30}
                      textAnchor="middle"
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
                          angle: -22.5,
                          textAnchor: "end",
                          fontSize: 5,
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
                      cornerRadius={{ topLeft: ({ datum }) => datum.count * 4 }}
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
                    <VictoryLabel
                      text="Client Site Visits vs Purchases"
                      x={30}
                      y={30}
                      textAnchor="middle"
                      style={{ fontSize: 20 }}
                    />
                  </div>
                  <VictoryChart
                    theme={VictoryTheme.material}
                    domainPadding={20}
                  >
                    <VictoryAxis
                      tickValues={[1, 2, 3, 4]}
                      tickFormat={["Q1", "Q2", "Q3", "Q4"]}
                    />
                    <VictoryAxis dependentAxis tickFormat={(x) => x} />
                    <VictoryStack colorScale={"qualitative"}>
                      {propertyData.map((data, index) => (
                        <VictoryBar
                          key={`stack-${index}`}
                          data={data}
                          x="quarter"
                          y="sales"
                          labels={({ datum }) => `${datum.sales}`}
                          labelComponent={<VictoryTooltip />}
                          animate={{ onLoad: { duration: 1000 } }}
                        />
                      ))}
                    </VictoryStack>
                  </VictoryChart>
                </div>
              </div>
              <div className="lg:w-2/3 xl:w-2/3 md:w-1/2 p-4">
                <div className="card w-full bg-base-100 shadow-xl">
                  <div className="m-4">
                    <VictoryLabel
                      text="Site Visits"
                      x={30}
                      y={30}
                      textAnchor="middle"
                      style={{ fontSize: 20 }}
                    />
                  </div>
                  <div style={{ position: "relative" }}>
                    <VictoryChart
                      theme={VictoryTheme.material}
                      domainPadding={20}
                      animate={{ duration: 1000 }}
                      width={600} // Add a width property for the chart
                      height={240}
                    >
                      <VictoryAxis
                        tickValues={siteData.map((data) => data.month)}
                        style={{ tickLabels: { angle: -90 } }}
                      />
                      <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />
                      <VictoryLine
                        data={siteData}
                        x="month"
                        y="visits"
                        labels={({ datum }) => `${datum.visits}`}
                        labelComponent={<VictoryTooltip />}
                      />
                    </VictoryChart>
                  </div>
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
