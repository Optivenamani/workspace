const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Route for the Add event modal
  router.post("/", async (req, res) => {
    const {
      educ_name,
      authenticateJWT,
      educ_age,
      educ_gender,
      educ_phone,
      educ_level,
      educ_amount,
    } = req.body;
    try {
      pool.query(
        "INSERT INTO `education`(`educ_name`, `educ_age`, `educ_gender`, `educ_phone`, `educ_level`, `educ_amount`)  VALUES (?, ?, ?, ?, ?, ?)",
        [educ_name, educ_age, educ_gender, educ_phone, educ_level, educ_amount],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message: "An error occurred while adding the Student.",
            });
          }
          res.status(201).json({ message: "Student added successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the Student.",
      });
    }
  });
//   Route to get Event Data
    router.get("/", async (req, res) => {
      try {
        pool.query("SELECT * FROM education", (err, results) => {
          if (err) throw err;

          res.json(results);
        });
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while fetching Student information.",
        });
      }
    });

  return router;
};
