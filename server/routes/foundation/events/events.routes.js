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

  return router;
};
