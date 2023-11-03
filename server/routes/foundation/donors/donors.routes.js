const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Route for the Add event modal
  router.post("/", authenticateJWT, async (req, res) => {
    const { donor_name, donor_amount, donor_confirmation, donor_pillar } =
      req.body;
    try {
      pool.query(
        "INSERT INTO Donors (donor_name, donor_amount, donor_confirmation, donor_pillar) VALUES (?, ?, ?, ?);",
        [donor_name, donor_amount, donor_confirmation, donor_pillar],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message: "An error occurred while uploading the Donor.",
            });
          }
          res.status(201).json({ message: "Donor uploaded successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while uploading the Donor.",
      });
    }
  });
  // Route to get Event Data
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM Donors", (err, results) => {
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
      "Amount Donated",
      "Confirmation",
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
