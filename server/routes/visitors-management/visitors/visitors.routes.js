const express = require("express");
//add correct path for authenticateJWT middleware
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // Input new visitor information
  router.post("/", authenticateJWT, async (req, res) => {
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

          res
            .status(201)
            .json({ message: "Visitor information added successfully." });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the visitor information.",
      });
    }
  });

  // Retrieve all visitor information
  router.get("/", authenticateJWT, async (req, res) => {
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
  });

// Retrieve a single visitor information by id
router.get("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    pool.query(
      `SELECT 
        visitors_information.id AS visitor_id,
        visitors_information.name, 
        visitors_information.email, 
        visitors_information.phone, 
        visitors_information.purpose, 
        visitors_information.vehicle_registration, 
        visitors_information.department, 
        visitors_information.check_in_time, 
        parking_information.entry_time, 
        parking_information.exit_time, 
        parking_information.duration
      FROM visitors_information 
      LEFT JOIN parking_information 
      ON visitors_information.id = parking_information.visitors_id 
      WHERE visitors_information.id = ?`,
      [id],
      (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
          res.status(404).json({ message: "Visitor information not found." });
        } else {
          const visitor = {
            visitor_id: results[0].visitor_id,
            name: results[0].name,
            email: results[0].email,
            phone: results[0].phone,
            purpose: results[0].purpose,
            vehicle_registration: results[0].vehicle_registration,
            department: results[0].department,
            check_in_time: results[0].check_in_time,
            entry_time: results[0].entry_time,
            exit_time: results[0].exit_time,
            duration: results[0].duration,
          };

          res.json(visitor);
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching the visitor information.",
    });
  }
});


  return router;
};
