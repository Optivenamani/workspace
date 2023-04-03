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
  { quarter: 1, visits: 1300 },
  { quarter: 2, visits: 1650 },
  { quarter: 3, visits: 1425 },
  { quarter: 4, visits: 1900 },
];

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

const pieData = [
  { x: "Acme Acres", y: 40 },
  { x: "South Park", y: 30 },
  { x: "Bedrock", y: 20 },
  { x: "Duckburg", y: 10 },
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
                    data={pieData}
                    x="x"
                    y="y"
                    colorScale={["navy", "skyBlue", "darkGreen", "lightGreen"]}
                    innerRadius={80}
                    labelRadius={({ innerRadius }) => innerRadius + 30}
                    labels={({ datum }) => `${datum.x}: ${datum.y}`}
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
                    <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />
                    <VictoryBar
                      data={clientData}
                      x="quarter"
                      y="visits"
                      labels={({ datum }) => `${datum.visits}`}
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
