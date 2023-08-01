const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // GET all workplan activities for the authenticated user
  router.get("/", (req, res) => {
    const { user_id } = req.query;
    pool.query(
      `SELECT 
        w_a.*,
        w.marketer_id AS marketer_id,
        u.fullnames AS name
      FROM workplan_activities w_a
      INNER JOIN workplans w
      ON w_a.workplan_id = w.id
      INNER JOIN defaultdb.users u
      ON u.user_id = w.marketer_id
      WHERE marketer_id = ?`,
      [user_id],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Server Error" });
        } else {
          res.json(results);
        }
      }
    );
  });

  // GET all workplan activities for the authenticated user
  router.get("/all", (req, res) => {
    const { user_id } = req.query;
    pool.query(
      `SELECT 
        wa.*,
        w.marketer_id AS marketer_id,
        u.fullnames AS name
      FROM workplan_activities wa
      INNER JOIN workplans w
      ON wa.workplan_id = w.id
      INNER JOIN defaultdb.users u
      ON u.user_id = w.marketer_id
      ORDER By date ASC`,
      [user_id],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Server Error" });
        } else {
          res.json(results);
        }
      }
    );
  });

  // GET a specific workplan activity
  router.get("/:id", (req, res) => {
    const { id } = req.params;
    const query = `SELECT 
        wa.*,
        w.marketer_id AS marketer_id,
        u.fullnames AS name
      FROM workplan_activities wa
      INNER JOIN workplans w
      ON wa.workplan_id = w.id
      INNER JOIN defaultdb.users u
      ON u.user_id = w.marketer_id 
      WHERE id = ?`;
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
  router.post("/", (req, res) => {
    const activities = req.body;
    const query =
      "INSERT INTO workplan_activities (workplan_id, date, time, title, expected_output) VALUES (?, ?, ?, ?, ?)";

    // Array to store the results of each INSERT query
    const results = [];

    // Iterate over the activities and execute the INSERT query for each activity
    activities.forEach((activity) => {
      const { workplan_id, date, time, title, expected_output } = activity;

      pool.query(
        query,
        [workplan_id, date, time, title, expected_output],
        (err, result) => {
          if (err) {
            console.error(err);
            results.push({
              error: true,
              message: "Error creating workplan activity",
            });
          } else {
            results.push({
              error: false,
              message: "Workplan activity created successfully",
            });
          }

          // Check if all queries have completed
          if (results.length === activities.length) {
            // Check if any errors occurred during the queries
            const hasErrors = results.some((result) => result.error);
            if (hasErrors) {
              res.status(500).json({ message: "Server Error" });
            } else {
              res.json({ message: "Workplan activities created successfully" });
            }
          }
        }
      );
    });
  });

  // UPDATE an existing workplan activity
  router.patch("/:id", (req, res) => {
    const { id } = req.params;
    const {
      workplan_id,
      date,
      time,
      title,
      expected_output,
      measurable_achievement,
      variance,
      comments,
      remarks,
    } = req.body;
    const query =
      "UPDATE workplan_activities SET workplan_id = ?, date = ?, time = ?, title = ?, expected_output = ?, measurable_achievement = ?, variance = ?, comments = ?, remarks = ? WHERE id = ?";
    pool.query(
      query,
      [
        workplan_id,
        date,
        time,
        title,
        expected_output,
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
  router.delete("/:id", (req, res) => {
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
