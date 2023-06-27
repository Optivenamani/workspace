const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // Add a new special assignment
  router.post("/", authenticateJWT, async (req, res) => {
    try {
      const {
        reservation_date,
        destination,
        reason,
        driver_id,
        reservation_time,
        vehicle_id,
        pickup_location,
        remarks,
        assigned_to,
      } = req.body;

      let { status } = req.body;

      if (!status) {
        // Assuming status should have a default value if not provided
        status = "pending";
      }

      const query = `
      INSERT INTO special_assignment (reservation_date, destination, reason, driver_id, reservation_time, vehicle_id, pickup_location, remarks, assigned_to, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
      const values = [
        reservation_date,
        destination,
        reason,
        driver_id,
        reservation_time,
        vehicle_id,
        pickup_location,
        remarks,
        assigned_to,
        status,
      ];
      pool.query(query, values, (err, result) => {
        if (err) throw err;
        res
          .status(201)
          .json({ message: "Special assignment created successfully." });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all special assignments
  router.get("/", async (req, res) => {
    try {
      const query = `
      SELECT 
        special_assignment.*, 
        users.fullnames AS driver_name, 
        vehicles.vehicle_registration 
      FROM special_assignment
      INNER JOIN users ON special_assignment.driver_id = users.user_id 
      INNER JOIN vehicles ON special_assignment.vehicle_id = vehicles.id;    
    `;
      pool.query(query, (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get a single special assignment by id
  router.get("/:id", authenticateJWT, async (req, res) => {
    try {
      const id = req.params.id;
      const query = `
      SELECT * FROM special_assignment WHERE id = ?;
    `;
      pool.query(query, [id], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          res.status(200).json(result[0]);
        } else {
          res.status(404).json({ message: "Special assignment not found." });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update a special assignment request
  router.patch("/:id", authenticateJWT, async (req, res) => {
    try {
      const id = req.params.id;
      const updates = req.body;

      const query = `
      UPDATE special_assignment
      SET ?
      WHERE id = ?;
    `;
      const values = [updates, id];

      pool.query(query, values, (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res
            .status(200)
            .json({ message: "Special assignment updated successfully." });
        } else {
          res.status(404).json({ message: "Special assignment not found." });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a special assignment
  router.delete("/:id", authenticateJWT, async (req, res) => {
    try {
      const id = req.params.id;
      const query = `
      DELETE FROM special_assignment
      WHERE id = ?;
    `;
      pool.query(query, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res
            .status(200)
            .json({ message: "Special assignment deleted successfully." });
        } else {
          res.status(404).json({ message: "Special assignment not found." });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Start a trip
  router.patch("/start-trip/:id", authenticateJWT, async (req, res) => {
    try {
      const id = req.params.id;
      const query = `
      UPDATE special_assignment 
      SET status = 'in_progress' 
      WHERE id = ?;
    `;
      pool.query(query, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.status(200).json({ message: "Trip started successfully." });
        } else {
          res.status(404).json({ message: "Special assignment not found." });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // End a trip
  router.patch("/end-trip/:id", authenticateJWT, async (req, res) => {
    try {
      const id = req.params.id;
      const query = `
      UPDATE special_assignment 
      SET status = 'completed' 
      WHERE id = ?;
    `;
      pool.query(query, [id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
          res.status(200).json({ message: "Trip ended successfully." });
        } else {
          res.status(404).json({ message: "Special assignment not found." });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
