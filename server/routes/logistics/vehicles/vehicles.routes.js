const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // Create a new vehicle
  router.post("/", authenticateJWT, async (req, res) => {
    const {
      make,
      model,
      body_type,
      number_of_seats,
      engine_capacity,
      vehicle_registration,
    } = req.body;

    try {
      pool.query(
        "INSERT INTO vehicles (make, model, body_type, number_of_seats, engine_capacity, vehicle_registration) VALUES (?, ?, ?, ?, ?, ?)",
        [
          make,
          model,
          body_type,
          number_of_seats,
          engine_capacity,
          vehicle_registration,
        ],
        (err, result) => {
          if (err) throw err;

          res.status(201).json({ message: "Vehicle created successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while creating the vehicle.",
      });
    }
  });
  // Retrieve all vehicles
  router.get("/", authenticateJWT, async (req, res) => {
    try {
      pool.query(
        "SELECT * FROM vehicles ORDER BY vehicle_registration ASC",
        (err, results) => {
          if (err) throw err;

          res.json(results);
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching vehicles.",
      });
    }
  });
  // Retrieve a single vehicle by id
  router.get("/vehicle/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
      pool.query(
        "SELECT * FROM vehicles WHERE id = ?",
        [id],
        (err, results) => {
          if (err) throw err;

          if (results.length === 0) {
            res.status(404).json({ message: "Vehicle not found." });
          } else {
            res.json(results[0]);
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the vehicle.",
      });
    }
  });
  // Retrieve all vehicles with status "available"
  router.get("/available", authenticateJWT, async (req, res) => {
    try {
      pool.query(
        "SELECT * FROM vehicles WHERE status = 'available' ORDER BY vehicle_registration ASC",
        (err, results) => {
          if (err) throw err;

          res.json(results);
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching available vehicles.",
      });
    }
  });
  // Update a vehicle
  router.patch("/:id", authenticateJWT, async (req, res) => {
    const {
      make,
      model,
      body_type,
      number_of_seats,
      engine_capacity,
      vehicle_registration,
    } = req.body;
    const { id } = req.params;
    try {
      pool.query(
        "UPDATE vehicles SET make = ?, model = ?, body_type = ?, number_of_seats = ?, engine_capacity = ?, vehicle_registration = ? WHERE id = ?",
        [
          make,
          model,
          body_type,
          number_of_seats,
          engine_capacity,
          vehicle_registration,
          id,
        ],
        (err, result) => {
          if (err) throw err;

          if (result.affectedRows === 0) {
            res.status(404).json({ message: "Vehicle not found." });
          } else {
            res.json({
              message: "Vehicle updated successfully.",
            });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while updating the vehicle.",
      });
    }
  });
  // Delete a vehicle
  router.delete("/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
      pool.query("DELETE FROM vehicles WHERE id = ?", [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows === 0) {
          res.status(404).json({ message: "Vehicle not found." });
        } else {
          res.json({ message: "Vehicle deleted successfully." });
        }
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while deleting the vehicle.",
      });
    }
  });
  return router;
};
