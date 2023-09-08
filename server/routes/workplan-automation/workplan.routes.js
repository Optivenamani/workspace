const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const checkPermissions = require("../../middleware/checkPermissions");
const router = express.Router();

module.exports = (pool) => {
  // GET all workplans for the authenticated user
  router.get("/", authenticateJWT, (req, res) => {
    const { user_id } = req.query;
    const query =
      "SELECT * FROM workplans WHERE marketer_id = ? ORDER BY end_date DESC";
    pool.query(query, [user_id], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else {
        res.json(results);
      }
    });
  });

  // GET all workplans for the authenticated user
  router.get("/all", authenticateJWT, (req, res) => {
    const { user_id } = req.query;
    const query = "SELECT * FROM workplans ORDER BY end_date DESC";
    pool.query(query, [user_id], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else {
        res.json(results);
      }
    });
  });

  // GET pending workplans for the authenticated user
  router.get("/pending", authenticateJWT, (req, res) => {
    const { user_id } = req.query;
    const query =
      "SELECT * FROM workplans WHERE status = 'pending' ORDER BY end_date DESC";
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

  // GET detailed workplan information including activities
  router.get("/:id/details", authenticateJWT, (req, res) => {
    const { id } = req.params;
    const query = `
    SELECT 
      wp.id AS workplan_id,
      wp.start_date,
      wp.end_date,
      wp.status AS workplan_status,
      wpa.id AS activity_id,
      wpa.date AS activity_date,
      wpa.time AS activity_time,
      wpa.title AS activity_title,
      wpa.expected_output AS activity_expected_output,
      wpa.measurable_achievement AS activity_measurable_achievement,
      wpa.variance AS activity_variance,
      wpa.comments AS activity_comments,
      wpa.remarks AS activity_remarks
    FROM workplans wp
    LEFT JOIN workplan_activities wpa ON wp.id = wpa.workplan_id
    WHERE wp.id = ?`;
    pool.query(query, [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else if (result.length > 0) {
        const workplanData = {
          id: result[0].workplan_id,
          start_date: result[0].start_date,
          end_date: result[0].end_date,
          status: result[0].workplan_status,
          activities: result.map((row) => ({
            id: row.activity_id,
            date: row.activity_date,
            time: row.activity_time,
            title: row.activity_title,
            expected_output: row.activity_expected_output,
            measurable_achievement: row.activity_measurable_achievement,
            variance: row.activity_variance,
            comments: row.activity_comments,
            remarks: row.activity_remarks,
          })),
        };
        res.json(workplanData);
      } else {
        res.status(404).json({ message: "Workplan not found" });
      }
    });
  });

  // CREATE a new workplan for the authenticated user
  router.post("/", authenticateJWT, (req, res) => {
    const { start_date, end_date, marketer_id, status } = req.body;

    // Check if any workplan with overlapping date range exists for the same marketer_id
    const checkQuery =
      "SELECT * FROM workplans WHERE marketer_id = ? AND start_date <= ? AND end_date >= ?";
    pool.query(
      checkQuery,
      [marketer_id, end_date, start_date],
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
            "INSERT INTO workplans (start_date, end_date, marketer_id, status) VALUES (?, ?, ?, ?)";
          pool.query(
            insertQuery,
            [start_date, end_date, marketer_id, status],
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

  // Route to approve a workplan (only accessible by authorized Level 1 Managers)
  router.put(
    "/:id/approve",
    // authenticateJWT,
    // checkPermissions(["level1Manager"]),
    (req, res) => {
      const { id } = req.params;
      const query = "UPDATE workplans SET status = 'Approved' WHERE id = ?";
      pool.query(query, [id], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Server Error" });
        } else if (result.affectedRows > 0) {
          res.json({ message: "Workplan approved successfully" });
        } else {
          res.status(404).json({ message: "Workplan not found" });
        }
      });
    }
  );

  // Route to reject a workplan (only accessible by authorized Level 1 Managers)
  router.put(
    "/:id/reject",
    // authenticateJWT,
    // checkPermissions(["level1Manager"]),
    (req, res) => {
      const { id } = req.params;
      const query = "UPDATE workplans SET status = 'Rejected' WHERE id = ?";
      pool.query(query, [id], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Server Error" });
        } else if (result.affectedRows > 0) {
          res.json({ message: "Workplan rejected successfully" });
        } else {
          res.status(404).json({ message: "Workplan not found" });
        }
      });
    }
  );

  // DELETE a workplan for the authenticated user
  router.delete("/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;

    const deleteActivitiesQuery =
      "DELETE FROM workplan_activities WHERE workplan_id = ?";
    pool.query(deleteActivitiesQuery, [id], (err, activityResult) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else {
        //  delete the workplan
        const deleteWorkplanQuery = "DELETE FROM workplans WHERE id = ?";
        pool.query(deleteWorkplanQuery, [id], (err, workplanResult) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Server Error" });
          } else if (workplanResult.affectedRows > 0) {
            res.json({
              message:
                "Workplan and associated activities deleted successfully",
            });
          } else {
            res.status(404).json({ message: "Workplan not found" });
          }
        });
      }
    });
  });

  return router;
};
