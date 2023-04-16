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
  router.get("/assigned-site-visits", async (req, res) => {
    try {
      const driverId = req.user.id; // Assuming the user is authenticated and their ID is stored in req.user.id
      const assignedSiteVisits = await SiteVisit.find({ driver: driverId });
      res.json(assignedSiteVisits);
    } catch (error) {
      console.error("Error fetching assigned site visits:", error);
      res.status(500).json({ message: "Error fetching assigned site visits" });
    }
  });
  return router;
};
