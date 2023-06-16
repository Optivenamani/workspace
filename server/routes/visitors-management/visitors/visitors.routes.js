const express = require("express");
//add correct path for authenticateJWT middleware
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // Input new visitor information
  router.post(
    "/",
    authenticateJWT,
    async (req, res) => {
      const {
        name,
        phone,
        email,
        vehicle_registration,
        purpose,
        department,
        check_in_time,
      } = req.body;

      try {
        pool.query(
          "INSERT INTO visitors_information (name, phone, email, vehicle_registration, purpose, department, check_in_time) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            name,
            phone,
            email,
            vehicle_registration,
            purpose,
            department,
            check_in_time,
          ],
          (err, result) => {
            if (err) throw err;

            res.status(201).json({ message: "Visitor information added successfully." });
          }
        );
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while adding the visitor information.",
        });
      }
    }
  );

  // Retrieve all visitor information
  router.get(
    "/",
    authenticateJWT,
    async (req, res) => {
      try {
        pool.query("SELECT * FROM visitors_information", (err, results) => {
          if (err) throw err;

          res.json(results);
        });
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while fetching visitor information.",
        });
      }
    }
  );

  // Retrieve a single visitor information by id
  router.get(
    "/:id",
    authenticateJWT,
    async (req, res) => {
      const { id } = req.params;

      try {
        pool.query(
          "SELECT * FROM visitors_information WHERE id = ?",
          [id],
          (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
              res.status(404).json({ message: "Visitor information not found." });
            } else {
              res.json(results[0]);
            }
          }
        );
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while fetching the visitor information.",
        });
      }
    }
  );

  return router;
};
