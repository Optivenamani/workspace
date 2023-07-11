const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // GET all tasks
  router.get("/", authenticateJWT, (req, res) => {
    pool.query("SELECT * FROM tasks", (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else {
        res.json(results);
      }
    });
  });

  // GET a specific task
  router.get("/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM tasks WHERE id = ?";
    pool.query(query, [id], (err, task) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else if (task.length > 0) {
        res.json(task[0]);
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    });
  });

  // CREATE a new task
  router.post("/", authenticateJWT, (req, res) => {
    const { workplan_id, title, description, time, date, expected_output } =
      req.body;
    const query =
      "INSERT INTO tasks (workplan_id, title, description, time, date, expected_output) VALUES (?, ?, ?, ?, ?, ?)";
    pool.query(
      query,
      [workplan_id, title, description, time, date, expected_output],
      (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Server Error" });
        } else {
          res.json({ message: "Task created successfully" });
        }
      }
    );
  });

  // UPDATE an existing task
  router.patch("/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;
    const {
      workplan_id,
      title,
      description,
      time,
      date,
      expected_output,
      actual_output,
      remarks,
    } = req.body;
    const query =
      "UPDATE tasks SET workplan_id = ?, title = ?, description = ?, time = ?, date = ?, expected_output = ?, actual_output = ?, remarks = ? WHERE id = ?";
    pool.query(
      query,
      [
        workplan_id,
        title,
        description,
        time,
        date,
        expected_output,
        actual_output,
        remarks,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Server Error" });
        } else if (result.affectedRows > 0) {
          res.json({ message: "Task updated successfully" });
        } else {
          res.status(404).json({ message: "Task not found" });
        }
      }
    );
  });

  // DELETE a task
  router.delete("/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM tasks WHERE id = ?";
    pool.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else if (result.affectedRows > 0) {
        res.json({ message: "Task deleted successfully" });
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    });
  });

  return router;
};
