const express = require("express");
const authenticateJWT = require("../../../server/middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // Create a new task
  router.post("/",  async (req, res) => {
    const { workplan_id, title, description, due_date, status, remarks } = req.body;

    try {
      pool.query(
        "INSERT INTO tasks (workplan_id, title, description, due_date, status, remarks) VALUES (?, ?, ?, ?, ?, ?)",
        [workplan_id, title, description, due_date, status, remarks],
        (err, result) => {
          if (err) throw err;

          const taskId = result.insertId;
          res.status(201).json({ id: taskId, message: "Task created successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while creating the task.",
      });
    }
  });

  // Retrieve all tasks
  router.get("/",  async (req, res) => {
    try {
      pool.query("SELECT * FROM tasks", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching tasks.",
      });
    }
  });

  // Retrieve a single task by id
  router.get("/:id",  async (req, res) => {
    const { id } = req.params;

    try {
      pool.query(
        "SELECT * FROM tasks WHERE id = ?",
        [id],
        (err, results) => {
          if (err) throw err;

          if (results.length === 0) {
            res.status(404).json({ message: "Task not found." });
          } else {
            res.json(results[0]);
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the task.",
      });
    }
  });

  // Delete a task
  router.delete("/:id",  async (req, res) => {
    const { id } = req.params;

    try {
      pool.query("DELETE FROM tasks WHERE id = ?", [id], (err, result) => {
        if (err) throw err;

        if (result.affectedRows === 0) {
          res.status(404).json({ message: "Task not found." });
        } else {
          res.json({ message: "Task deleted successfully." });
        }
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while deleting the task.",
      });
    }
  });

  return router;
};
