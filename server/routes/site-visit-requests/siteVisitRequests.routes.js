const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const AccessRoles = require("../../constants/accessRoles");
const checkPermissions = require("../../middleware/checkPermissions");
const router = express.Router();

module.exports = (connection) => {
  // Get all site visits with driver and vehicle info
  router.get(
    "/all",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
    ]),
    async (req, res) => {
      try {
        const query = `
      SELECT 
        site_visits.*,
        Projects.name AS site_name,
        COUNT(site_visit_clients.id) as num_clients,
        users.fullnames as marketer_name,
        drivers.fullnames as driver_name,
        vehicles.vehicle_registration as vehicle_name
      FROM site_visits
      LEFT JOIN Projects
        ON site_visits.project_id = Projects.project_id
      LEFT JOIN site_visit_clients
        ON site_visits.id = site_visit_clients.site_visit_id
      LEFT JOIN users
        ON site_visits.marketer_id = users.user_id
      LEFT JOIN users as drivers
        ON site_visits.driver_id = drivers.user_id
      LEFT JOIN vehicles
        ON site_visits.vehicle_id = vehicles.id
      GROUP BY site_visits.id
      ORDER BY site_visits.created_at DESC;
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
  // Get a single pending site visit request
  router.get(
    "/pending-site-visits/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
    ]),
    async (req, res) => {
      const id = req.params.id;
      const query = `
      SELECT 
        site_visits.*,
        Projects.name AS site_name,
        COUNT(site_visit_clients.id) as num_clients,
        users.fullnames as marketer_name,
        drivers.fullnames as driver_name
      FROM site_visits 
      LEFT JOIN Projects 
        ON site_visits.project_id = Projects.project_id 
      LEFT JOIN site_visit_clients 
        ON site_visits.id = site_visit_clients.site_visit_id
      LEFT JOIN users 
        ON site_visits.marketer_id = users.user_id
      LEFT JOIN users as drivers
        ON site_visits.driver_id = drivers.user_id
      WHERE site_visits.id = ?
      GROUP BY site_visits.id
      ORDER BY site_visits.created_at ASC;
    `;
      connection.query(query, [id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: "Site visit request not found." });
        }
      });
    }
  );
  // Reject site visit request (with remarks)
  router.patch(
    "/reject-site-visit/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
    ]),
    async (req, res) => {
      try {
        const id = req.params.id;
        const { remarks } = req.body;
        const query =
          "UPDATE site_visits SET status = 'rejected', remarks = ?, vehicle_id = null, driver_id = null WHERE id = ?";
        connection.query(query, [remarks, id], (err, result) => {
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
  // View, edit and approve the site visit request
  router.patch(
    "/pending-site-visits/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
    ]),
    async (req, res) => {
      try {
        const { id } = req.params;
        const {
          vehicle_id,
          pickup_location,
          pickup_date,
          pickup_time,
          remarks,
          status,
          driver_id,
        } = req.body;

        if (vehicle_id) {
          // Check if the vehicle is available and has enough seats
          const checkVehicleQuery = `SELECT 
              number_of_seats, 
              passengers_assigned 
            FROM vehicles 
            WHERE id = ? AND status = 'available'`;
          connection.query(
            checkVehicleQuery,
            [vehicle_id],
            (err, vehicleResults) => {
              if (err) throw err;
              if (vehicleResults.length > 0) {
                const numberOfSeats = vehicleResults[0].number_of_seats;
                const passengersAssigned =
                  vehicleResults[0].passengers_assigned;
                const checkClientsQuery = `SELECT COUNT(*) as client_count
                  FROM site_visit_clients 
                  WHERE site_visit_id = ?`;
                connection.query(
                  checkClientsQuery,
                  [id],
                  (err, clientResults) => {
                    if (err) throw err;
                    const clientCount = clientResults[0].client_count;

                    // Add 1 for the marketer
                    if (numberOfSeats >= clientCount + 1 + passengersAssigned) {
                      // Update site visit
                      const query = `
                        UPDATE site_visits
                        SET 
                          vehicle_id = ?,
                          pickup_location = ?, 
                          pickup_date = ?, 
                          pickup_time = ?, 
                          remarks = ?, 
                          status = ?, 
                          driver_id = ?
                        WHERE id = ?
                      `;

                      connection.query(
                        query,
                        [
                          vehicle_id,
                          pickup_location,
                          pickup_date,
                          pickup_time,
                          remarks,
                          status === "pending" ? "approved" : status,
                          driver_id,
                          id,
                        ],
                        async (err, results) => {
                          if (err) {
                            res.status(500).json({ error: err.message });
                            return;
                          }

                          // New SELECT query to get the updated site visit with the driver's name
                          const updatedSiteVisitQuery = `
                            SELECT 
                              site_visits.*,
                              Projects.name AS site_name,
                              COUNT(site_visit_clients.id) as num_clients,
                              users.fullnames as marketer_name,
                              drivers.fullnames as driver_name
                            FROM site_visits 
                            LEFT JOIN Projects 
                              ON site_visits.project_id = Projects.project_id 
                            LEFT JOIN site_visit_clients 
                              ON site_visits.id = site_visit_clients.site_visit_id
                            LEFT JOIN users 
                              ON site_visits.marketer_id = users.user_id
                            LEFT JOIN users as drivers
                              ON site_visits.driver_id = drivers.user_id
                            WHERE site_visits.id = ?
                            GROUP BY site_visits.id
                            ORDER BY site_visits.created_at ASC;
                          `;

                          connection.query(
                            updatedSiteVisitQuery,
                            [id],
                            (err, updatedResults) => {
                              if (err) {
                                res.status(500).json({ error: err.message });
                                return;
                              }

                              if (updatedResults.length > 0) {
                                res.status(200).json(updatedResults[0]);
                              } else {
                                res.status(404).json({
                                  message: "Updated site visit not found.",
                                });
                              }
                            }
                          );
                        }
                      );
                    } else {
                      const seatsExceeded =
                        clientCount + 1 + passengersAssigned - numberOfSeats;
                      res.status(400).json({
                        message:
                          "The selected vehicle does not have enough seats.",
                        exceeded_by: seatsExceeded,
                      });
                    }
                  }
                );
              } else {
                res.status(404).json({
                  message: "Available vehicle not found.",
                });
              }
            }
          );
        } else {
          // Update site visit without vehicle
          const query = `
            UPDATE site_visits
            SET 
              vehicle_id = ?,
              pickup_location = ?, 
              pickup_date = ?, 
              pickup_time = ?, 
              remarks = ?, 
              status = ?, 
              driver_id = ?
            WHERE id = ?
          `;
          connection.query(
            query,
            [
              null,
              pickup_location,
              pickup_date,
              pickup_time,
              remarks,
              status === "pending" ? "approved" : status,
              driver_id,
              id,
            ],
            (err, results) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
              res
                .status(200)
                .json({ message: "Site visit updated successfully." });
            }
          );
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  
  return router;
};
