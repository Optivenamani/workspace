const express = require("express");
const router = express.Router();

module.exports = (pool) => {
  // Input new parking information
  router.post("/", async (req, res) => {
    const { name, vehicle_registration, arrival_time } = req.body;

    try {
      if (!name || !vehicle_registration || !arrival_time) {
        return res.status(400).json({
          message: "Please provide all required information.",
        });
      }

      // Format arrival_time value using the current date
      const formattedArrivalTime = new Date().toISOString().slice(0, 10) + " " + arrival_time;

      pool.query(
        "INSERT INTO parking (name, vehicle_registration, arrival_time) VALUES (?, ?, ?)",
        [name, vehicle_registration, formattedArrivalTime],
        (err, result) => {
          if (err) {
            console.error("Error adding parking information:", err);
            return res.status(500).json({
              message: "An error occurred while adding parking information.",
            });
          }

          res.status(201).json({
            message: "Parking information added successfully.",
          });
        }
      );
    } catch (error) {
      console.error("Error adding parking information:", error);
      res.status(500).json({
        message: "An error occurred while adding parking information.",
      });
    }
  });

  // Retrieve all parking information
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM parking ORDER BY id DESC", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching parking information.",
      });
    }
  });

  // Retrieve a single parking information by id
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      pool.query(
        "SELECT * FROM parking WHERE id = ?",
        [id],
        (err, results) => {
          if (err) throw err;

          if (results.length === 0) {
            res
              .status(404)
              .json({ message: "Parking information not found." });
          } else {
            const parkingInfo = results[0];

            res.json(parkingInfo);
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the parking information.",
      });
    }
  });

  // Update parking information
  router.patch("/:id", async (req, res) => {
    const {
      name,
      vehicle_registration,
      arrival_time
    } = req.body;
    const { id } = req.params;

    try {
      pool.query(
        "UPDATE parking SET name = ?, vehicle_registration = ?, arrival_time = ? WHERE id = ?",
        [
          name,
          vehicle_registration,
          arrival_time,
          id
        ],
        (err, result) => {
          if (err) throw err;

          if (result.affectedRows === 0) {
            res.status(404).json({ message: "Parking information not found." });
          } else {
            res.json({
              message: "Parking information updated successfully.",
            });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while updating the parking information.",
      });
    }
  });

  // Delete parking information
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      pool.query(
        "DELETE FROM parking WHERE id = ?",
        [id],
        (err, result) => {
          if (err) throw err;

          if (result.affectedRows === 0) {
            res.status(404).json({ message: "Parking information not found." });
          } else {
            res.json({ message: "Parking information deleted successfully." });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while deleting the parking information.",
      });
    }
  });

  return router;
};
