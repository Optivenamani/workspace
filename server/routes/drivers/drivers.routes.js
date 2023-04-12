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
  // Create a new driver
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
      const { driver_name, driver_email, driver_phone_number, driver_address } =
        req.body;

      try {
        connection.query(
          "INSERT INTO drivers (driver_name, driver_email, driver_phone_number, driver_address) VALUES (?, ?, ?, ?)",
          [driver_name, driver_email, driver_phone_number, driver_address],
          (err, result) => {
            if (err) throw err;

            res.status(201).json({ message: "Driver created successfully!" });
          }
        );
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while creating the driver.",
        });
      }
    }
  );

  // Retrieve all drivers
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
        connection.query("SELECT * FROM drivers", (err, results) => {
          if (err) throw err;

          res.json(results);
        });
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while fetching drivers.",
        });
      }
    }
  );

  // Retrieve a single driver by driver_id
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
          "SELECT * FROM drivers WHERE driver_id = ?",
          [id],
          (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
              res.status(404).json({ message: "Driver not found." });
            } else {
              res.json(results[0]);
            }
          }
        );
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while fetching the driver.",
        });
      }
    }
  );

  // Update a driver
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
      const { driver_name, driver_email, driver_phone_number, driver_address } =
        req.body;
      const { id } = req.params;

      try {
        connection.query(
          "UPDATE drivers SET driver_name = ?, driver_email = ?, driver_phone_number = ?, driver_address = ? WHERE driver_id = ?",
          [driver_name, driver_email, driver_phone_number, driver_address, id],
          (err, result) => {
            if (err) throw err;

            if (result.affectedRows === 0) {
              res.status(404).json({ message: "Driver not found." });
            } else {
              res.json({
                message: "Driver updated successfully.",
              });
            }
          }
        );
      } catch (error) {
        res.status(500).json({
          message:
            "An error occurred while updating the site visit request status.",
        });
      }
    }
  );
  
  // Delete a driver
  router.delete(
    "/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
    ]),
    async (req, res) => {
      const { id } = req.params;

      try {
        connection.query(
          "DELETE FROM drivers WHERE driver_id = ?",
          [id],
          (err, result) => {
            if (err) throw err;
            if (result.affectedRows === 0) {
              res.status(404).json({ message: "Driver not found." });
            } else {
              res.json({ message: "Driver deleted successfully." });
            }
          }
        );
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while deleting the driver.",
        });
      }
    }
  );

  return router;
};
