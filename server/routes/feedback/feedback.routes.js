const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // GET all feedback
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM users_feedback", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching feedback.",
      });
    }
  });

  // CREATE a new feedback
  router.post("/", async (req, res) => {
    const { user_id, name, feedback } = req.body;

    try {
      pool.query(
        "INSERT INTO users_feedback (user_id, name, feedback) VALUES (?, ?, ?)",
        [user_id, name, feedback],
        (err, result) => {
          if (err) throw err;

          res.status(201).json({ message: "Feedback created successfully" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "Server Error.",
      });
    }
  });

  return router;
};
