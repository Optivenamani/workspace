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
      staff_id,
      visitor_room,
    } = req.body;

    try {
      pool.query(
        "INSERT INTO visitors_information (name, phone, email, vehicle_registration, purpose, department, check_in_time, check_in_date, staff_id, visitor_room) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          phone,
          email,
          vehicle_registration,
          purpose,
          department,
          check_in_time,
          check_in_date,
          staff_id,
          visitor_room,
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
      pool.query(
        "SELECT vi.*, u.email as staff_email, u.fullnames as staff_name FROM visitors_information vi INNER JOIN defaultdb.users u ON vi.staff_id = u.user_id",
        (err, results) => {
          if (err) throw err;

          res.json(results);
        }
      );
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
        visitors_information.*,
        users.fullnames as staff_name
      FROM visitors_information
      INNER JOIN defaultdb.users ON visitors_information.staff_id = users.user_id 
      WHERE id = ?`,
        [id],
        (err, results) => {
          if (err) throw err;

          if (results.length === 0) {
            res.status(404).json({ message: "Visitor information not found." });
          } else {
            const visitor = results[0];

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
      staff_id,
      visitor_room,
    } = req.body;
    const { id } = req.params;

    try {
      pool.query(
        "UPDATE visitors_information SET name = ?, phone = ?, email = ?, vehicle_registration = ?, purpose = ?, department = ?, check_in_time = ?, check_in_date = ?, staff_id = ?, visitor_room = ? WHERE id = ?",
        [
          name,
          phone,
          email,
          vehicle_registration,
          purpose,
          department,
          check_in_time,
          check_in_date,
          staff_id,
          visitor_room,
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
