const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Route for the Add event modal
  router.post("/", async (req, res) => {
    const {
      event_name,
      authenticateJWT,
      event_location,
      event_amount,
      pillar,
    } = req.body;
    try {
      pool.query(
        "INSERT INTO Events (event_name, event_location, event_amount, pillar) VALUES (?, ?, ?, ?)",
        [event_name, event_location, event_amount, pillar],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message: "An error occurred while creating the event.",
            });
          }
          res.status(201).json({ message: "Event created successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while creating the event.",
      });
    }
  });

  router.get("/pillar-count", (req, res) => {
    const { pillar } = req.query;
    pool.query(
      `SELECT * FROM Events WHERE pillar = ?`,
      [pillar],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Server Error" });
        } else {
          res.json(results);
        }
      }
    );
  });

  //Route to get Event Data
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM Events", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching Event information.",
      });
    }
  });

  // Route to download Excel sheet
  router.get("/download-template", (req, res) => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add data to the worksheet (for example, headers)
    worksheet.addRow([
      "Name of The student",
      "Location",
      "Amount Disbursed",
      "Pillar",
    ]);

    // Set response headers to trigger download
    res.setHeader("Content-Disposition", "attachment; filename=template.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Write workbook to response and send it to the client
    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  });
  return router;
};
