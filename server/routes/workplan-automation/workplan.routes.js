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
        }, // New column for date
        { text: activities[i].activity_time ?? "", style: "tableCell" }, // New column for time
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
  // GET all workplans for the authenticated user
  router.get("/", authenticateJWT, (req, res) => {
    const { user_id } = req.query;
    const query =
      "SELECT * FROM workplans WHERE marketer_id = ? ORDER BY end_date DESC";
    pool.query(query, [user_id], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else {
        res.json(results);
      }
    });
  });

  // GET a specific workplan
  router.get("/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM workplans WHERE id = ?";
    pool.query(query, [id], (err, workplan) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else if (workplan.length > 0) {
        res.json(workplan[0]);
      } else {
        res.status(404).json({ message: "Workplan not found" });
      }
    });
  });

  // CREATE a new workplan for the authenticated user
  router.post("/", (req, res) => {
    const { start_date, end_date, marketer_id } = req.body;

    // Check if any workplan with overlapping date range exists for the same marketer_id
    const checkQuery =
      "SELECT * FROM workplans WHERE marketer_id = ? AND start_date <= ? AND end_date >= ?";
    pool.query(
      checkQuery,
      [marketer_id, end_date, start_date], // Swap end_date and start_date to ensure correct comparison
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Server Error" });
        } else if (results.length > 0) {
          // If a workplan with overlapping date range exists, return an error response
          res.status(409).json({
            message:
              "A workplan with overlapping date range already exists for this marketer.",
            status: 409,
          });
        } else {
          // If no workplan with overlapping date range exists, insert the new workplan
          const insertQuery =
            "INSERT INTO workplans (start_date, end_date, marketer_id) VALUES (?, ?, ?)";
          pool.query(
            insertQuery,
            [start_date, end_date, marketer_id],
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).json({ message: "Server Error" });
              } else {
                res.json({ message: "Workplan created successfully" });
              }
            }
          );
        }
      }
    );
  });

  // UPDATE an existing workplan for the authenticated user
  router.put("/:id", authenticateJWT, (req, res) => {
    const { user_id } = req.user;
    const { id } = req.params;
    const { start_date, end_date } = req.body;
    const query =
      "UPDATE workplans SET start_date = ?, end_date = ? WHERE id = ? AND marketer_id = ?";
    pool.query(query, [start_date, end_date, id, user_id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else if (result.affectedRows > 0) {
        res.json({ message: "Workplan updated successfully" });
      } else {
        res.status(404).json({ message: "Workplan not found" });
      }
    });
  });

  // DELETE a workplan for the authenticated user
  router.delete("/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;

    const deleteActivitiesQuery =
      "DELETE FROM workplan_activities WHERE workplan_id = ?";
    pool.query(deleteActivitiesQuery, [id], (err, activityResult) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else {
        //  delete the workplan
        const deleteWorkplanQuery = "DELETE FROM workplans WHERE id = ?";
        pool.query(deleteWorkplanQuery, [id], (err, workplanResult) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Server Error" });
          } else if (workplanResult.affectedRows > 0) {
            res.json({
              message:
                "Workplan and associated activities deleted successfully",
            });
          } else {
            res.status(404).json({ message: "Workplan not found" });
          }
        });
      }
    });
  });

  // Download workplans as a PDF
  router.get("/download-pdf/workplans", async (req, res) => {
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
      WHERE wp.start_date >= ? AND wp.end_date <= ?
      ORDER BY wp.end_date DESC;
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

  return router;
};
