const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const AccessRoles = require("../../constants/accessRoles");
const router = express.Router();

// Middleware for checking user permissions
const checkPermissions = (allowedRoles) => {
  return (req, res, next) => {
    const userAccessRole = req.user.Accessrole;

    if (allowedRoles.some((role) => userAccessRole.includes(role))) {
      next();
    } else {
      res.status(403).json({
        message: "Forbidden: You don't have permission to perform this action.",
      });
    }
  };
};

module.exports = (connection) => {
  // Create a new vehicle
  router.post(
    "/",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
      AccessRoles.isOperations1,
      AccessRoles.isOperations2,
      AccessRoles.isOperations3,
    ]),
    async (req, res) => {
      const {
        make,
        model,
        body_type,
        number_of_seats,
        engine_capacity,
        vehicle_registration,
      } = req.body;

      try {
        connection.query(
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
    }
  );

  // Retrieve all vehicles
  router.get(
    "/",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
      AccessRoles.isOperations1,
      AccessRoles.isOperations2,
      AccessRoles.isOperations3,
    ]),
    async (req, res) => {
      try {
        connection.query("SELECT * FROM vehicles", (err, results) => {
          if (err) throw err;

          res.json(results);
        });
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while fetching vehicles.",
        });
      }
    }
  );

  // Retrieve a single vehicle by id
  router.get(
    "/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
      AccessRoles.isOperations1,
      AccessRoles.isOperations2,
      AccessRoles.isOperations3,
    ]),
    async (req, res) => {
      const { id } = req.params;

      try {
        connection.query(
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
    }
  );

  // Update a vehicle
  router.patch(
    "/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
      AccessRoles.isOperations1,
      AccessRoles.isOperations2,
      AccessRoles.isOperations3,
    ]),
    async (req, res) => {
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
        connection.query(
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
    }
  );

  // Delete a vehicle
  router.delete(
    "/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
      AccessRoles.isOperations1,
      AccessRoles.isOperations2,
      AccessRoles.isOperations3,
    ]),
    async (req, res) => {
      const { id } = req.params;
      try {
        connection.query(
          "DELETE FROM vehicles WHERE id = ?",
          [id],
          (err, result) => {
            if (err) throw err;
            if (result.affectedRows === 0) {
              res.status(404).json({ message: "Vehicle not found." });
            } else {
              res.json({ message: "Vehicle deleted successfully." });
            }
          }
        );
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while deleting the vehicle.",
        });
      }
    }
  );

  return router;
};
