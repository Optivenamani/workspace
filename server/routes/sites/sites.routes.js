const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
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
  // Get all sites
  router.get("/", authenticateJWT, async (req, res) => {
    try {
      connection.query("SELECT * FROM Projects", (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching sites.",
      });
    }
  });
  return router;
};
