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
      check_in_date,
    } = req.body;

    try {
      pool.query(
        "INSERT INTO visitors_information (name, phone, email, vehicle_registration, purpose, department, check_in_time, check_in_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          phone,
          email,
          vehicle_registration,
          purpose,
          department,
          check_in_time,
          check_in_date,
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
        id AS visitor_id,
        name, 
        email, 
        phone, 
        purpose, 
        vehicle_registration, 
        department, 
        check_in_time, 
        check_in_date,
        check_out_time
      FROM visitors_information 
      WHERE id = ?`,
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
              check_in_date: results[0].check_in_date,
              check_out_time: results[0].check_out_time,
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

  // Update a visitor
  router.patch("/:id", authenticateJWT, async (req, res) => {
    const {
      name,
      phone,
      email,
      vehicle_registration,
      purpose,
      department,
      check_in_time,
      check_in_date,
    } = req.body;
    const { id } = req.params;
    try {
      pool.query(
        "UPDATE visitors_information SET name = ?, phone = ?, email = ?, vehicle_registration = ?, purpose = ?, department = ?, check_in_time = ?, check_in_date = ? WHERE id = ?",
        [
          name,
          phone,
          email,
          vehicle_registration,
          purpose,
          department,
          check_in_time,
          check_in_date,
          id,
        ],
        (err, result) => {
          if (err) throw err;

          if (result.affectedRows === 0) {
            res.status(404).json({ message: "Visitor not found." });
          } else {
            res.json({
              message: "Visitor updated successfully.",
            });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while updating the visitor.",
      });
    }
  });

  // Checkout a visitor
  router.patch("/checkout/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { check_out_time } = req.body;

    try {
      if (check_out_time) {
        pool.query(
          "UPDATE visitors_information SET check_out_time = ? WHERE id = ?",
          [check_out_time, id],
          (err, result) => {
            if (err) throw err;

            if (result.affectedRows === 0) {
              res.status(404).json({ message: "Visitor not found." });
            } else {
              res.json({ message: "Visitor updated successfully." });
            }
          }
        );
      } else {
        res.status(400).json({ message: "Missing check-out time." });
      }
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while updating the visitor.",
      });
    }
  });

  return router;
};
