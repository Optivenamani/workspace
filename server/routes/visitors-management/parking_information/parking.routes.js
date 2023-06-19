const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // Input new parking information
  router.post(
    "/",
    authenticateJWT,
    async (req, res) => {
      const {
        visitors_id,
        entry_time,
        exit_time,
      } = req.body;

      try {
        pool.query(
          "INSERT INTO parking_information (visitors_id, entry_time, exit_time) VALUES (?, ?, ?)",
          [
            visitors_id,
            entry_time,
            exit_time,
          ],
          (err, result) => {
            if (err) throw err;

            res.status(201).json({ message: "Parking information added successfully." });
          }
        );
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while adding the parking information.",
        });
      }
    }
  );

  // Retrieve all parking information
  router.get(
    "/",
    authenticateJWT,
    async (req, res) => {
      try {
        pool.query("SELECT * FROM parking_information", (err, results) => {
          if (err) throw err;

          res.json(results);
        });
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while fetching parking information.",
        });
      }
    }
  );

  // Retrieve a single parking information by id
  router.get(
    "/:id",
    authenticateJWT,
    async (req, res) => {
      const { id } = req.params;

      try {
        pool.query(
          "SELECT * FROM parking_information WHERE id = ?",
          [id],
          (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
              res.status(404).json({ message: "Parking information not found." });
            } else {
              res.json(results[0]);
            }
          }
        );
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while fetching the parking information.",
        });
      }
    }
  );

  return router;
};
