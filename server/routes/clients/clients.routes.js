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
  // Create a new client
  router.post(
    "/",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isMarketer,
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
    ]),
    async (req, res) => {
      const { name, email, phone_number } = req.body;

      try {
        // Insert the new client into the `clients` table
        connection.query(
          "INSERT INTO clients (name, email, phone_number) VALUES (?, ?, ?)",
          [name, email, phone_number],
          (err, result) => {
            if (err) throw err;

            res.status(201).json({ message: "Client created successfully!" });
          }
        );
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while creating the client.",
        });
      }
    }
  );
  return router;
};
