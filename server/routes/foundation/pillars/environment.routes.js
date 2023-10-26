const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Route for the Add event modal
  router.post("/", async (req, res) => {
    const { env_name, authenticateJWT, env_amount, env_comment } = req.body;
    try {
      pool.query(
        "INSERT INTO `environment`(`env_name`, `env_amount`, `env_comment`)  VALUES (?, ?, ?)",
        [env_name, env_amount, env_comment],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message: "An error occurred while adding the Environmental Project.",
            });
          }
          res.status(201).json({ message: "Environmental Project added successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the Environmental Project.",
      });
    }
  });
  //   Route to get Event Data
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM environment", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching Environmental Project",
      });
    }
  });

  return router;
};
