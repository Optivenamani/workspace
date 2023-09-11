const express = require("express");
const pdfMakePrinter = require("pdfmake/src/printer");
const authenticateJWT = require("../../middleware/authenticateJWT");
const router = express.Router();

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Define fonts
var fonts = {
  Roboto: {
    normal: "node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf",
    bold: "node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf",
    italic: "node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf",
    bolditalics:
      "node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf",
  },
};

// Create a new printer with the fonts
var printer = new pdfMakePrinter(fonts);

// Map data to fields that go to the pdf
function dataToPdfRows(data) {
  const groupedData = {};

  // Group activities by marketer_name
  for (const item of data) {
    const { marketer_name, ...activity } = item;
    if (!groupedData[marketer_name]) {
      groupedData[marketer_name] = [];
    }
    groupedData[marketer_name].push(activity);
  }

  const pdfRows = [];

  // Convert grouped data into PDF rows
  for (const marketer in groupedData) {
    const activities = groupedData[marketer];
    pdfRows.push([
      { text: marketer ?? "", style: "tableCell" },
      { text: activities[0].activity_title ?? "", style: "tableCell" },
      {
        text: formatDate(activities[0].activity_date) ?? "",
        style: "tableCell",
      }, // New column for date
      { text: activities[0].activity_time ?? "", style: "tableCell" }, // New column for time
      {
        text: activities[0].activity_expected_output ?? "",
        style: "tableCell",
      },
      {
        text: activities[0].activity_measurable_achievement ?? "",
        style: "tableCell",
      },
      { text: activities[0].activity_comments ?? "", style: "tableCell" },
      { text: activities[0].activity_remarks ?? "", style: "tableCell" },
    ]);

    // Add rows for additional activities under the same marketer
    for (let i = 1; i < activities.length; i++) {
      pdfRows.push([
        { text: "", style: "tableCell" },
        { text: activities[i].activity_title ?? "", style: "tableCell" },
        {
          text: formatDate(activities[i].activity_date) ?? "",
          style: "tableCell",
        },
        { text: activities[i].activity_time ?? "", style: "tableCell" },
        {
          text: activities[i].activity_expected_output ?? "",
          style: "tableCell",
        },
        {
          text: activities[i].activity_measurable_achievement ?? "",
          style: "tableCell",
        },
        { text: activities[i].activity_comments ?? "", style: "tableCell" },
        { text: activities[i].activity_remarks ?? "", style: "tableCell" },
      ]);
    }
  }

  return pdfRows;
}

module.exports = (pool) => {
  // Download workplan reports as a PDF
  router.get("/team", authenticateJWT, async (req, res) => {
    try {
      const { start_date, end_date } = req.query;

      // Define the SQL query to fetch workplan data
      const query = `
        SELECT
          wp.*,
          u.fullnames as marketer_name,
          wpa.title as activity_title,
          wpa.expected_output as activity_expected_output,
          wpa.measurable_achievement as activity_measurable_achievement,
          wpa.comments as activity_comments,
          wpa.remarks as activity_remarks,
          wpa.date as activity_date,
          wpa.time as activity_time
        FROM workplans wp
        INNER JOIN defaultdb.users u ON wp.marketer_id = u.user_id
        LEFT JOIN workplan_activities wpa ON wp.id = wpa.workplan_id
        WHERE wpa.date >= ? AND wpa.date <= ?
        ORDER BY wpa.date DESC, wpa.time DESC;
      `;
      // Execute the SQL query
      pool.query(query, [start_date, end_date], (err, results) => {
        if (err) throw err;

        // Define the document definition for the PDF
        const docDefinition = {
          pageSize: "A4",
          pageOrientation: "landscape",
          content: [
            {
              text: `Workplan Reports from ${start_date} to ${end_date}`,
              fontSize: 20,
              alignment: "center",
              margin: [0, 0, 0, 20],
            },
            {
              table: {
                headerRows: 1,
                widths: [
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                ], // Include widths for new columns
                body: [
                  [
                    {
                      text: "Marketer Name",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Activity",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Date",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Time",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Expected Output",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Measurable Achievement",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Marketer Comments",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Regional Manager Remarks",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                  ],
                ],
              },
              // Inside the document definition for the table
              layout: {
                hLineWidth: function (i, node) {
                  return 1; // Horizontal line width
                },
                vLineWidth: function (i, node) {
                  return i === 0 ? 0 : 1; // Vertical line width, skip for the first column
                },
                hLineColor: function (i, node) {
                  return "#202A44"; // Horizontal line color
                },
                vLineColor: function (i, node) {
                  return "#202A44"; // Vertical line color
                },
                fillColor: function (rowIndex, node, columnIndex) {
                  return rowIndex % 2 === 0 ? "#D3D3D3" : null;
                },
              },
            },
          ],
          styles: {
            tableHeader: {
              bold: true,
              fontSize: 13,
              color: "white",
            },
            tableCell: {
              fontSize: 12,
              margin: [0, 5],
            },
          },
        };

        // Populate the body array of the table with the fetched data
        docDefinition.content[1].table.body.push(...dataToPdfRows(results));
        // Create the PDF document using pdfmake
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        // Set the response headers to indicate a PDF file
        res.setHeader("Content-Type", "application/pdf");
        // Stream the PDF document as the response
        pdfDoc.pipe(res);
        pdfDoc.end();
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while generating the PDF.");
    }
  });

  // Modify the route to accept GET requests
  router.get("/marketer", async (req, res) => {
    try {
      const { start_date, end_date, marketer } = req.query;

      // Check if the required data is provided
      if (!marketer || !start_date || !end_date) {
        return res.status(400).json({
          error: "marketer, start_date, and end_date are required fields.",
        });
      }

      // Define the SQL query to fetch workplan data for a specific marketer
      const query = `
      SELECT
        wp.*,
        u.fullnames as marketer_name,
        wpa.title as activity_title,
        wpa.expected_output as activity_expected_output,
        wpa.measurable_achievement as activity_measurable_achievement,
        wpa.comments as activity_comments,
        wpa.remarks as activity_remarks,
        wpa.date as activity_date,
        wpa.time as activity_time
      FROM workplans wp
      INNER JOIN defaultdb.users u ON wp.marketer_id = u.user_id
      LEFT JOIN workplan_activities wpa ON wp.id = wpa.workplan_id
      WHERE wpa.date >= ? AND wpa.date <= ? AND wp.marketer_id = ?
      ORDER BY wpa.date DESC, wpa.time DESC;
    `;

      // Execute the SQL query
      pool.query(query, [start_date, end_date, marketer], (err, results) => {
        if (err) throw err;

        // Log the data to inspect its structure
        console.log("Individual reports for", marketer, ":", results);

        // Define the document definition for the PDF
        const docDefinition = {
          pageSize: "A4",
          pageOrientation: "landscape",
          content: [
            {
              text: `Workplan Reports from ${start_date} to ${end_date} for Marketer: ${marketer}`,
              fontSize: 20,
              alignment: "center",
              margin: [0, 0, 0, 20],
            },
            {
              table: {
                headerRows: 1,
                widths: [
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                ], // Include widths for new columns
                body: [
                  [
                    {
                      text: "Marketer Name",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Activity",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Date",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Time",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Expected Output",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Measurable Achievement",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Marketer Comments",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                    {
                      text: "Regional Manager Remarks",
                      fillColor: "#202A44",
                      style: "tableHeader",
                    },
                  ],
                ],
              },
              // Inside the document definition for the table
              layout: {
                hLineWidth: function (i, node) {
                  return 1; // Horizontal line width
                },
                vLineWidth: function (i, node) {
                  return i === 0 ? 0 : 1; // Vertical line width, skip for the first column
                },
                hLineColor: function (i, node) {
                  return "#202A44"; // Horizontal line color
                },
                vLineColor: function (i, node) {
                  return "#202A44"; // Vertical line color
                },
                fillColor: function (rowIndex, node, columnIndex) {
                  return rowIndex % 2 === 0 ? "#D3D3D3" : null;
                },
              },
            },
          ],
          styles: {
            tableHeader: {
              bold: true,
              fontSize: 13,
              color: "white",
            },
            tableCell: {
              fontSize: 12,
              margin: [0, 5],
            },
          },
        };

        // Populate the body array of the table with the fetched data
        docDefinition.content[1].table.body.push(...dataToPdfRows(results));
        // Create the PDF document using pdfmake
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        // Set the response headers to indicate a PDF file
        res.setHeader("Content-Type", "application/pdf");
        // Stream the PDF document as the response
        pdfDoc.pipe;

        pdfDoc.pipe(res);
        pdfDoc.end();
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while generating the PDF." });
    }
  });

  return router;
};
