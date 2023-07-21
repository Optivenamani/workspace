const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // GET all workplans for the authenticated user
  router.get("/", authenticateJWT, (req, res) => {
    const { user_id } = req.query;
    const query = "SELECT * FROM workplans WHERE marketer_id = ?";
    pool.query(query, [user_id], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else {
        res.json(results);
      }
    });
  });

  // GET a specific workplan
  router.get("/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM workplans WHERE id = ?";
    pool.query(query, [id], (err, workplan) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else if (workplan.length > 0) {
        res.json(workplan[0]);
      } else {
        res.status(404).json({ message: "Workplan not found" });
      }
    });
  });

  // CREATE a new workplan for the authenticated user
  router.post("/", authenticateJWT, (req, res) => {
    const { user_id } = req.user;
    const { start_date, end_date } = req.body;
    const query =
      "INSERT INTO workplans (start_date, end_date, marketer_id) VALUES (?, ?, ?)";
    pool.query(query, [start_date, end_date, user_id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else {
        res.json({ message: "Workplan created successfully" });
      }
    });
  });

  // UPDATE an existing workplan for the authenticated user
  router.put("/:id", authenticateJWT, (req, res) => {
    const { user_id } = req.user;
    const { id } = req.params;
    const { start_date, end_date } = req.body;
    const query =
      "UPDATE workplans SET start_date = ?, end_date = ? WHERE id = ? AND marketer_id = ?";
    pool.query(query, [start_date, end_date, id, user_id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else if (result.affectedRows > 0) {
        res.json({ message: "Workplan updated successfully" });
      } else {
        res.status(404).json({ message: "Workplan not found" });
      }
    });
  });

  // DELETE a workplan for the authenticated user
  router.delete("/:id", authenticateJWT, (req, res) => {
    const { user_id } = req.user;
    const { id } = req.params;
    const query = "DELETE FROM workplans WHERE id = ? AND marketer_id = ?";
    pool.query(query, [id, user_id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else if (result.affectedRows > 0) {
        res.json({ message: "Workplan deleted successfully" });
      } else {
        res.status(404).json({ message: "Workplan not found" });
      }
    });
  });

  return router;
};
