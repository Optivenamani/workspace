const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // Define your database query functions or ORM operations here

  // Create a new meeting
router.post("/", authenticateJWT, async (req, res) => {
    try {
      // Extract meeting data from the request body
      const {
        client_name,
        client_number,
        arrival_time,
        meeting_date,
        purpose,
        room,
      } = req.body;
  
      // Insert the meeting data into the database
      const [result] = await pool.promise().query(
        "INSERT INTO meetings (client_name, client_number, arrival_time, meeting_date, purpose, room) VALUES (?, ?, ?, ?, ?, ?)",
        [client_name, client_number, arrival_time, meeting_date, purpose, room]
      );
  
      // Fetch the inserted meeting data
      const [insertedMeeting] = await pool.promise().query(
        "SELECT * FROM meetings WHERE id = ?",
        [result.insertId]
      );
  
      // Return the inserted meeting data
      res.status(201).json(insertedMeeting[0]);
    } catch (error) {
      console.error("Error creating meeting:", error);
      res.status(500).json({ error: "An error occurred while creating the meeting." });
    }
  });
  
  // Retrieve all meeting information
  router.get("/", authenticateJWT, async (req, res) => {
    try {
      // Fetch meetings from the database
      const [meetings] = await pool.promise().query("SELECT * FROM meetings");

      // Return the meetings data
      res.status(200).json(meetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ error: "An error occurred while fetching meetings." });
    }
  });

  // Update a meeting
  router.patch("/:id", authenticateJWT, async (req, res) => {
    try {
      const meetingId = req.params.id;
      const {
        client_name,
        client_number,
        arrival_time,
        meeting_date,
        purpose,
        room,
      } = req.body;

      // Update the meeting in the database
      const [updatedMeeting] = await pool.promise().query(
        "UPDATE meetings SET client_name = ?, client_number = ?, arrival_time = ?, meeting_date = ?, purpose = ?, room = ? WHERE id = ? RETURNING *",
        [client_name, client_number, arrival_time, meeting_date, purpose, room, meetingId]
      );

      // Return the updated meeting data
      if (updatedMeeting) {
        res.status(200).json(updatedMeeting);
      } else {
        res.status(404).json({ message: "Meeting not found." });
      }
    } catch (error) {
      console.error("Error updating meeting:", error);
      res.status(500).json({ error: "An error occurred while updating the meeting." });
    }
  });

  // ... Other routes ...

  return router;
};
