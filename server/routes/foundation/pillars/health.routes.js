const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Route for the Add event modal
  router.post("/", async (req, res) => {
    const { health_name, health_age, health_complication, health_amount, health_gender, health_contact,authenticateJWT } = req.body;
    try {
      pool.query(
        "INSERT INTO  `health`(`health_name`, `health_age`, `health_complication`, `health_amount`, `health_gender`, `health_contact`)   VALUES (?, ?, ?, ?, ?, ?)",
        [health_name, health_age, health_complication, health_amount, health_gender, health_contact],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message:
                "An error occurred while adding the Health Project.",
            });
          }
          res
            .status(201)
            .json({ message: "Health Project added successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the Health Project.",
      });
    }
  });
  //   Route to get Event Data
    router.get("/", async (req, res) => {
      try {
        pool.query("SELECT * FROM health", (err, results) => {
          if (err) throw err;

          res.json(results);
        });
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while fetching the Health Project",
        });
      }
    });

  return router;
};
