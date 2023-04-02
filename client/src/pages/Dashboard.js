import React from "react";
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

const clientData = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 },
];

const siteData = [
  { month: "Jan", visits: 1200 },
  { month: "Feb", visits: 1000 },
  { month: "Mar", visits: 1400 },
  { month: "Apr", visits: 1800 },
];

const pieData = [
  { x: "Residential", y: 40 },
  { x: "Commercial", y: 30 },
  { x: "Industrial", y: 20 },
  { x: "Agricultural", y: 10 },
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
  return (
    <>
      <Sidebar>
        <section className="text-gray-600 body-font bg-base-200">
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
                    data={pieData}
                    x="x"
                    y="y"
                    colorScale={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]}
                    innerRadius={80}
                    labelRadius={({ innerRadius }) => innerRadius + 30}
                    labels={({ datum }) => `${datum.x}: ${datum.y}%`}
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
                    domainPadding={20}
                    animate={{ duration: 1000 }}
                  >
                    <VictoryAxis
                      tickValues={[1, 2, 3, 4]}
                      tickFormat={["Q1", "Q2", "Q3", "Q4"]}
                    />
                    <VictoryAxis
                      dependentAxis
                      tickFormat={(x) => `$${x / 1000}k`}
                    />
                    <VictoryBar
                      data={clientData}
                      x="quarter"
                      y="earnings"
                      labels={({ datum }) => `$${datum.earnings}`}
                      labelComponent={<VictoryTooltip />}
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
                    <VictoryAxis
                      dependentAxis
                      tickFormat={(x) => `$${x / 1000}k`}
                    />
                    <VictoryStack colorScale={"qualitative"}>
                      {propertyData.map((data, index) => (
                        <VictoryBar
                          key={`stack-${index}`}
                          data={data}
                          x="quarter"
                          y="sales"
                          labels={({ datum }) => `$${datum.sales}`}
                          labelComponent={<VictoryTooltip />}
                          animate={{ onLoad: { duration: 1000 } }}
                        />
                      ))}
                    </VictoryStack>
                  </VictoryChart>
                </div>
              </div>
              <div className="xl:w-1/3  md:w-1/2 p-4">
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
                    domainPadding={20}
                    animate={{ duration: 1000 }}
                  >
                    <VictoryAxis
                      tickValues={siteData.map((data) => data.month)}
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
        </section>
      </Sidebar>
    </>
  );
};

export default Dashboard;
