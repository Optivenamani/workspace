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

  router.patch("/:id/report", authenticateJWT, async (req, res) => {
    try {
      const meetingId = req.params.id;
      const { report_time } = req.body;
  
      const [existingMeeting] = await pool.promise().query(
        "SELECT report_time, exit_time FROM meetings WHERE id = ?",
        [meetingId]
      );
  
      if (!existingMeeting) {
        return res.status(404).json({ message: "Meeting not found." });
      }
  
      if (existingMeeting.report_time) {
        return res.status(400).json({ message: "Report time is already set and cannot be updated." });
      }
  
      await pool.promise().query(
        "UPDATE meetings SET report_time = ? WHERE id = ?",
        [report_time, meetingId]
      );
  
      res.status(200).json({ message: "Report time updated successfully." });
    } catch (error) {
      console.error("Error updating report time:", error);
      res.status(500).json({ error: "An error occurred while updating the report time." });
    }
  });
  
  router.patch("/:id/exit", authenticateJWT, async (req, res) => {
    try {
      const meetingId = req.params.id;
      const { exit_time } = req.body;
  
      const [existingMeeting] = await pool.promise().query(
        "SELECT report_time, exit_time FROM meetings WHERE id = ?",
        [meetingId]
      );
  
      if (!existingMeeting) {
        return res.status(404).json({ message: "Meeting not found." });
      }
  
      if (existingMeeting.exit_time) {
        return res.status(400).json({ message: "Exit time is already set and cannot be updated." });
      }
  
      await pool.promise().query(
        "UPDATE meetings SET exit_time = ? WHERE id = ?",
        [exit_time, meetingId]
      );
  
      res.status(200).json({ message: "Exit time updated successfully." });
    } catch (error) {
      console.error("Error updating exit time:", error);
      res.status(500).json({ error: "An error occurred while updating the exit time." });
    }
  });
  
  
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      pool.query(
        "DELETE FROM meetings WHERE id = ?",
        [id],
        (err, result) => {
          if (err) {
            console.error("Error deleting meeting:", err);
            res.status(500).json({
              message: "An error occurred while deleting the meeting.",
            });
          } else if (result.affectedRows === 0) {
            res.status(404).json({ message: "Meeting not found." });
          } else {
            res.json({ message: "Meeting deleted successfully." });
          }
        }
      );
    } catch (error) {
      console.error("Error deleting meeting:", error);
      res.status(500).json({
        message: "An error occurred while deleting the meeting.",
      });
    }
  });
  
  
  
  
  // ... Other routes ...

  return router;
};
