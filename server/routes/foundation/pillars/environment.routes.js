const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();
const ExcelJS = require("exceljs");
const multer = require("multer");

module.exports = (pool, io) => {
  // Route for the Add event modal
  router.post("/", async (req, res) => {
    const { env_name, authenticateJWT, env_amount, env_comment } = req.body;
    try {
      pool.query(
        "INSERT INTO `environment`(`env_name`, `env_amount`, `env_comment`)  VALUES (?, ?, ?)",
        [env_name, env_amount, env_comment],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message: "An error occurred while adding the Environmental Project.",
            });
          }
          res.status(201).json({ message: "Environmental Project added successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the Environmental Project.",
      });
    }
  });
  //   Route to get Event Data
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM environment", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching Environmental Project",
      });
    }
  });

  router.get("/download-template", (req, res) => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add data to the worksheet (for example, headers)
    worksheet.addRow([
      "Name of The student",      
      "Amount Disbursed",
      "Comment",

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
