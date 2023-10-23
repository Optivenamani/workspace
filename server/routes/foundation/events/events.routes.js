require("dotenv").config();
const express = require("express");
const axios = require("axios");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Endpoint to handle data insertion
  router.post("/", async (req, res) => {
    const { event_name, event_location, event_amount } = req.body;

    try {
      // Insert data into the Events table
      const [results] = await connection.query(
        "INSERT INTO Events (event_name, event_location, event_amount) VALUES (?, ?, ?)",
        [event_name, event_location, event_amount]
      );
      // If insertion is successful, you can handle the response accordingly
      res.json({ success: true, message: "Data inserted successfully" });
    } catch (error) {
      console.error("Error:", error);
      // If there's an error during insertion, handle it appropriately
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  });
};
