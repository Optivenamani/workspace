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
  // Get all the pending site visit requests
  router.get(
    "/pending-site-visits",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
    ]),
    async (req, res) => {
      try {
        const query = `SELECT 
        site_visits.id, 
        site_visits.status, 
        site_visits.pickup_location,
        site_visits.pickup_time,
        site_visits.pickup_date,
        site_visits.created_at,
        Projects.name AS site_name,
        COUNT(site_visit_clients.id) as num_clients,
        users.fullnames as marketer_name
      FROM site_visits 
      LEFT JOIN Projects 
        ON site_visits.project_id = Projects.project_id 
      LEFT JOIN site_visit_clients 
        ON site_visits.id = site_visit_clients.site_visit_id
      LEFT JOIN users 
        ON site_visits.marketer_id = users.user_id
      WHERE site_visits.status = 'pending'
      GROUP BY site_visits.id
      ORDER BY site_visits.created_at ASC;      
      `;
        connection.query(query, (err, results) => {
          if (err) throw err;
          res.status(200).json(results);
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Approve site visit request
  router.post(
    "/approve-site-visit/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
    ]),
    async (req, res) => {
      try {
        const id = req.params.id;
        const query = "UPDATE site_visits SET status = 'approved' WHERE id = ?";
        connection.query(query, [id], (err, result) => {
          if (err) throw err;
          if (result.affectedRows > 0) {
            res.status(200).json({ message: "Site visit request approved." });
          } else {
            res.status(404).json({ message: "Site visit request not found." });
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Reject site visit request with a reason
  router.post(
    "/reject-site-visit/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
    ]),
    async (req, res) => {
      try {
        const id = req.params.id;
        const { rejection_reason } = req.body;
        const query =
          "UPDATE site_visits SET status = 'rejected', rejection_reason = ? WHERE id = ?";
        connection.query(query, [rejection_reason, id], (err, result) => {
          if (err) throw err;
          if (result.affectedRows > 0) {
            res.status(200).json({ message: "Site visit request rejected." });
          } else {
            res.status(404).json({ message: "Site visit request not found." });
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Place marketer and client in a vehicle
  router.post(
    "/assign-vehicle/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
    ]),
    async (req, res) => {
      try {
        const site_visit_id = req.params.id;
        const { vehicle_id } = req.body;

        // Check if site visit exists and is approved
        const checkSiteVisitQuery =
          "SELECT * FROM site_visits WHERE id = ? AND status = 'approved'";
        connection.query(
          checkSiteVisitQuery,
          [site_visit_id],
          (err, siteVisitResults) => {
            if (err) throw err;
            if (siteVisitResults.length > 0) {
              // Check if the vehicle has enough seats
              const checkVehicleSeatsQuery =
                "SELECT number_of_seats FROM vehicles WHERE id = ?";
              connection.query(
                checkVehicleSeatsQuery,
                [vehicle_id],
                (err, vehicleResults) => {
                  if (err) throw err;
                  if (vehicleResults.length > 0) {
                    const numberOfSeats = vehicleResults[0].number_of_seats;
                    const checkClientsQuery =
                      "SELECT COUNT(*) as client_count FROM site_visit_clients WHERE site_visit_id = ?";
                    connection.query(
                      checkClientsQuery,
                      [site_visit_id],
                      (err, clientResults) => {
                        if (err) throw err;
                        const clientCount = clientResults[0].client_count;
                        // Add 1 for the marketer
                        if (numberOfSeats >= clientCount + 1) {
                          // Update vehicle_id in the site_visits table
                          const updateSiteVisitQuery =
                            "UPDATE site_visits SET vehicle_id = ? WHERE id = ?";
                          connection.query(
                            updateSiteVisitQuery,
                            [vehicle_id, site_visit_id],
                            (err, result) => {
                              if (err) throw err;
                              res.status(200).json({
                                message:
                                  "Vehicle assigned to site visit successfully.",
                              });
                            }
                          );
                        } else {
                          res.status(400).json({
                            message:
                              "The selected vehicle does not have enough seats.",
                          });
                        }
                      }
                    );
                  } else {
                    res.status(404).json({
                      message: "Vehicle not found.",
                    });
                  }
                }
              );
            } else {
              res
                .status(404)
                .json({ message: "Approved site visit request not found." });
            }
          }
        );
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Assign driver to a vehicle
  router.post(
    "/assign-vehicle-driver/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
    ]),
    async (req, res) => {
      try {
        const site_visit_id = req.params.id;
        const { user_id } = req.body; // assuming user_id is the driver's user_id

        // Check if site visit exists and is approved
        const checkSiteVisitQuery =
          "SELECT * FROM site_visits WHERE id = ? AND status = 'approved'";
        connection.query(
          checkSiteVisitQuery,
          [site_visit_id],
          (err, siteVisitResults) => {
            if (err) throw err;
            if (siteVisitResults.length > 0) {
              // Update driver_id in the site_visits table
              const updateSiteVisitQuery =
                "UPDATE site_visits SET driver_id = ? WHERE id = ?";
              connection.query(
                updateSiteVisitQuery,
                [user_id, site_visit_id],
                (err, result) => {
                  if (err) throw err;
                  res.status(200).json({
                    message: "Driver assigned to vehicle successfully.",
                  });
                }
              );
            } else {
              res
                .status(404)
                .json({ message: "Approved site visit request not found." });
            }
          }
        );
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  return router;
};
