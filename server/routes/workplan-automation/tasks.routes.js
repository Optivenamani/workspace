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

router.post("/", authenticateJWT, async (req, res) => {
  const tasks = req.body;

  try {
    const insertPromises = tasks.map((task) => {
      const {
        workplan_id,
        title,
        description,
        time,
        date,
        expected_output,
        status,
      } = task; // Use task[0] to extract the properties

      return new Promise((resolve, reject) => {
        pool.query(
          "INSERT INTO tasks (workplan_id, title, description, time, date, expected_output, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            workplan_id,
            title,
            description,
            time,
            date,
            expected_output,
            status,
          ],
          (err, result) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    });

    Promise.all(insertPromises)
      .then(() => {
        res.status(201).json({ message: "Tasks created successfully." });
      })
      .catch((error) => {
        console.error("Error creating tasks:", error);
        res
          .status(500)
          .json({ message: "An error occurred while creating tasks." });
      });
  } catch (error) {
    console.error("Error creating tasks:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating tasks." });
  }
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
      status,
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
        status,
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
