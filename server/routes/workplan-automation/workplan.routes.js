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
  router.post("/", (req, res) => {
    const { start_date, end_date, marketer_id } = req.body;

    // Check if any workplan with overlapping date range exists for the same marketer_id
    const checkQuery =
      "SELECT * FROM workplans WHERE marketer_id = ? AND start_date <= ? AND end_date >= ?";
    pool.query(
      checkQuery,
      [marketer_id, end_date, start_date], // Swap end_date and start_date to ensure correct comparison
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Server Error" });
        } else if (results.length > 0) {
          // If a workplan with overlapping date range exists, return an error response
          res.status(409).json({
            message:
              "A workplan with overlapping date range already exists for this marketer.",
            status: 409,
          });
        } else {
          // If no workplan with overlapping date range exists, insert the new workplan
          const insertQuery =
            "INSERT INTO workplans (start_date, end_date, marketer_id) VALUES (?, ?, ?)";
          pool.query(
            insertQuery,
            [start_date, end_date, marketer_id],
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).json({ message: "Server Error" });
              } else {
                res.json({ message: "Workplan created successfully" });
              }
            }
          );
        }
      }
    );
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
