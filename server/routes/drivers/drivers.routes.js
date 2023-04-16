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
  router.get(
    "/assigned-site-visits",
    authenticateJWT,
    checkPermissions([
      AccessRoles.driver69,
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
    ]),
    async (req, res) => {
      try {
        const driverId = req.user.id;
        const query = `SELECT site_visits.*, 
        GROUP_CONCAT(site_visit_clients.id) as client_ids, 
        GROUP_CONCAT(site_visit_clients.name) as client_names, 
        GROUP_CONCAT(site_visit_clients.email) as client_emails, 
        GROUP_CONCAT(site_visit_clients.phone_number) as client_phone_numbers,
        Projects.name as site_name
      FROM site_visits
      LEFT JOIN site_visit_clients 
      ON site_visits.id = site_visit_clients.site_visit_id
      LEFT JOIN Projects
      ON site_visits.project_id = Projects.project_id
      WHERE (site_visits.status = 'approved' OR site_visits.status = 'in_progress') AND site_visits.driver_id = ?
      GROUP BY site_visits.id;
      `;

        connection.query(query, [driverId], (err, results) => {
          if (err) throw err;
          res.status(200).json(results);
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  return router;
};
