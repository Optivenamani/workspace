const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Route for the Add event modal
  router.post("/", async (req, res) => {
    const {
      health_name,
      health_age,
      health_complication,
      health_amount,
      health_gender,
      health_contact,
      authenticateJWT,
    } = req.body;
    try {
      pool.query(
        "INSERT INTO  `health`(`health_name`, `health_age`, `health_complication`, `health_amount`, `health_gender`, `health_contact`)   VALUES (?, ?, ?, ?, ?, ?)",
        [
          health_name,
          health_age,
          health_complication,
          health_amount,
          health_gender,
          health_contact,
        ],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message: "An error occurred while adding the Health Project.",
            });
          }
          res
            .status(201)
            .json({ message: "Health Project added successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the Health Project.",
      });
    }
  });
  //   Route to get Event Data
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM health", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the Health Project",
      });
    }
  });

  router.get("/download-template", (req, res) => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add data to the worksheet (for example, headers)
    worksheet.addRow([
      "Name of The assisted",
      "Age of The assisted",
      "Gender of The assisted",
      "Phone Contact",
      "Health Complication",
      "Amount Disbursed",
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
