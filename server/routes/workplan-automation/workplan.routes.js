const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // GET all workplans
  router.get("/",  (req, res) => {
    pool.query("SELECT * FROM workplans", (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else {
        res.json(results);
      }
    });
  });

  // GET a specific workplan
  router.get("/:id",  (req, res) => {
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

  // CREATE a new workplan
  router.post("/",  (req, res) => {
    const { title, user_id } = req.body;
    const query = "INSERT INTO workplans (title, user_id) VALUES (?, ?)";
    pool.query(query, [title, user_id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else {
        res.json({ message: "Workplan created successfully" });
      }
    });
  });

  // UPDATE an existing workplan
  router.put("/:id",  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const query = "UPDATE workplans SET title = ? WHERE id = ?";
    pool.query(query, [title, id], (err, result) => {
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

  // DELETE a workplan
  router.delete("/:id",  (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM workplans WHERE id = ?";
    pool.query(query, [id], (err, result) => {
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
