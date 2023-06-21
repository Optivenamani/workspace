const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // Create a new workplan
  router.post("/", authenticateJWT,  async (req, res) => {
    const { user_id, title, created_at } = req.body;

    try {
      pool.query(
        "INSERT INTO workplan (user_id, title) VALUES (?, ?)",
        [user_id, title],
        (err, result) => {
          if (err) throw err;

          const workplanId = result.insertId;
          res.status(201).json({ id: workplanId, message: "Workplan created successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while creating the workplan.",
      });
    }
  });

  // Retrieve all workplans
  router.get("/", authenticateJWT, async (req, res) => {
    try {
      pool.query("SELECT * FROM workplan", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching workplans.",
      });
    }
  });

  // Retrieve a single workplan by id
  router.get("/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
      pool.query(
        "SELECT * FROM workplan WHERE id = ?",
        [id],
        (err, results) => {
          if (err) throw err;

          if (results.length === 0) {
            res.status(404).json({ message: "Workplan not found." });
          } else {
            res.json(results[0]);
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the workplan.",
      });
    }
  });

  // Delete a workplan and associated tasks
  router.delete("/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
      pool.query("DELETE FROM workplan WHERE id = ?", [id], (err, result) => {
        if (err) throw err;

        if (result.affectedRows === 0) {
          res.status(404).json({ message: "Workplan not found." });
        } else {
          // Delete associated tasks
          pool.query("DELETE FROM tasks WHERE workplanid = ?", [id], (err, result) => {
            if (err) throw err;

            res.json({ message: "Workplan and associated tasks deleted successfully." });
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while deleting the workplan.",
      });
    }
  });

  return router;
};
