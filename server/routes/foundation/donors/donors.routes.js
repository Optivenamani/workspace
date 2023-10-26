const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Route for the Add event modal
  router.post("/", authenticateJWT, async (req, res) => {
    const {
      donor_name,
      donor_amount,
      donor_confirmation,
      donor_pillar,
    } = req.body;
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

  return router;
};
