const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Endpoint to handle data insertion
  router.post("/", async (req, res) => {
    const { event_name, event_location, event_amount, pillar } = req.body;

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

  return router;
};
