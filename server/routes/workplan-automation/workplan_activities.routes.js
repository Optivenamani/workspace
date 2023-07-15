const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // GET all workplan activities
  router.get("/", authenticateJWT, (req, res) => {
    pool.query("SELECT * FROM workplan_activities", (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else {
        res.json(results);
      }
    });
  });

  // GET a specific workplan activity
  router.get("/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM workplan_activities WHERE id = ?";
    pool.query(query, [id], (err, activity) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else if (activity.length > 0) {
        res.json(activity[0]);
      } else {
        res.status(404).json({ message: "Workplan activity not found" });
      }
    });
  });

  // CREATE a new workplan activity
  router.post("/", authenticateJWT, (req, res) => {
    const {
      workplan_id,
      date,
      time,
      title,
      expected_output,
      target,
      measurable_achievement,
      variance,
      comments,
      remarks,
    } = req.body;
    const query =
      "INSERT INTO workplan_activities (workplan_id, date, time, title, expected_output, target, measurable_achievement, variance, comments, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    pool.query(
      query,
      [
        workplan_id,
        date,
        time,
        title,
        expected_output,
        target,
        measurable_achievement,
        variance,
        comments,
        remarks,
      ],
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Server Error" });
        } else {
          res.json({ message: "Workplan activity created successfully" });
        }
      }
    );
  });

  // UPDATE an existing workplan activity
  router.patch("/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;
    const {
      workplan_id,
      date,
      time,
      title,
      expected_output,
      target,
      measurable_achievement,
      variance,
      comments,
      remarks,
    } = req.body;
    const query =
      "UPDATE workplan_activities SET workplan_id = ?, date = ?, time = ?, title = ?, expected_output = ?, target = ?, measurable_achievement = ?, variance = ?, comments = ?, remarks = ? WHERE id = ?";
    pool.query(
      query,
      [
        workplan_id,
        date,
        time,
        title,
        expected_output,
        target,
        measurable_achievement,
        variance,
        comments,
        remarks,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Server Error" });
        } else if (result.affectedRows > 0) {
          res.json({ message: "Workplan activity updated successfully" });
        } else {
          res.status(404).json({ message: "Workplan activity not found" });
        }
      }
    );
  });

  // DELETE a workplan activity
  router.delete("/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM workplan_activities WHERE id = ?";
    pool.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else if (result.affectedRows > 0) {
        res.json({ message: "Workplan activity deleted successfully" });
      } else {
        res.status(404).json({ message: "Workplan activity not found" });
      }
    });
  });

  return router;
};
