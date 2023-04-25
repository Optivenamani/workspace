const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const AccessRoles = require("../../constants/accessRoles");
const checkPermissions = require("../../middleware/checkPermissions");
const router = express.Router();

module.exports = (pool) => {
  // Get assigned site visit deets
  router.get(
    "/assigned-site-visits",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isDriver,
    ]),
    async (req, res) => {
      try {
        const driverId = req.user.id;
        const query = `SELECT site_visits.*, 
          Projects.name as site_name
        FROM site_visits
        LEFT JOIN Projects
        ON site_visits.project_id = Projects.project_id
        WHERE (site_visits.status = 'approved' OR site_visits.status = 'in_progress') AND site_visits.driver_id = ?`;

        pool.query(query, [driverId], async (err, results) => {
          if (err) throw err;

          const siteVisits = results;

          const getClientDetailsQuery =
            "SELECT name, email, phone_number FROM site_visit_clients WHERE site_visit_id = ?";
          const getTotalPassengersQuery =
            "SELECT COUNT(*) as total_passengers FROM site_visit_clients WHERE site_visit_id = ?";

          for (const siteVisit of siteVisits) {
            await new Promise((resolve, reject) => {
              pool.query(
                getClientDetailsQuery,
                [siteVisit.id],
                (err, clientResults) => {
                  if (err) return reject(err);
                  siteVisit.clients = clientResults;
                  resolve();
                }
              );
            });

            await new Promise((resolve, reject) => {
              pool.query(
                getTotalPassengersQuery,
                [siteVisit.id],
                (err, totalPassengersResult) => {
                  if (err) return reject(err);
                  siteVisit.total_passengers =
                    totalPassengersResult[0].total_passengers + 1; // Add 1 to account for the marketer
                  resolve();
                }
              );
            });
          }

          res.status(200).json(siteVisits);
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Get all drivers
  router.get(
    "/all-drivers",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
    ]),
    async (req, res) => {
      try {
        const query = `SELECT * 
        FROM users
        WHERE (users.Accessrole = 'driver69' OR users.Accessrole = '     112#114#700')`;
        pool.query(query, async (err, results) => {
          if (err) throw err;
          const drivers = results;
          res.status(200).json(drivers);
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Get assigned vehicle requests
  router.get(
    "/assigned-vehicle-requests",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isDriver,
    ]),
    async (req, res) => {
      try {
        const driverId = req.user.id;
        const query = `
          SELECT * FROM vehicle_requests
          WHERE (status = 'approved' OR status = 'in_progress') 
          AND driver_id = ?
          `;

        pool.query(query, [driverId], (err, results) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.status(200).json(results);
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  return router;
};
