const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const AccessRoles = require("../../constants/accessRoles");
const checkPermissions = require("../../middleware/checkPermissions");
const router = express.Router();

module.exports = (connection) => {
  // Create a new site visit request
  router.post("/", authenticateJWT, async (req, res) => {
    const { project_id, pickup_location, pickup_time, pickup_date, clients } =
      req.body;
    const marketer_id = req.body.marketer_id; // Get the authenticated user ID from the JWT

    try {
      // Insert the site visit request into the `site_visits` table
      connection.query(
        "INSERT INTO site_visits (marketer_id, project_id, pickup_location, pickup_time, pickup_date, status) VALUES (?, ?, ?, ?, ?, 'pending')",
        [marketer_id, project_id, pickup_location, pickup_time, pickup_date],
        (err, result) => {
          if (err) throw err;

          const siteVisitId = result.insertId; // Get the site_visit_id of the created site visit request

          // Insert clients associated with this site visit request into the `site_visit_clients` table
          const clientValues = clients.map((client) => [
            siteVisitId, // Add the siteVisitId here
            client.name,
            client.email,
            client.phone_number,
          ]);
          connection.query(
            "INSERT INTO site_visit_clients (site_visit_id, name, email, phone_number) VALUES ?",
            [clientValues],
            (err, result) => {
              if (err) throw err;
              res
                .status(201)
                .json({ message: "Site visit request created successfully!" });
            }
          );
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while creating the site visit request.",
      });
    }
  });

  // Retrieve all site visit requests
  router.get("/", authenticateJWT, async (req, res) => {
    try {
      connection.query(
        `SELECT site_visits.*, 
        site_visit_clients.id as client_id, 
        site_visit_clients.name, 
        site_visit_clients.email, 
        site_visit_clients.phone_number,
        Projects.name as site_name
       FROM site_visits
       LEFT JOIN site_visit_clients 
       ON site_visits.id = site_visit_clients.site_visit_id
       LEFT JOIN Projects
       ON site_visits.project_id = Projects.project_id
      `,
        (err, results) => {
          if (err) throw err;

          // Process the results here, then send the response
          const siteVisitsMap = {};

          results.forEach((row) => {
            if (!siteVisitsMap[row.id]) {
              siteVisitsMap[row.id] = {
                id: row.id,
                site_name: row.site_name,
                pickup_location: row.pickup_location,
                pickup_time: row.pickup_time,
                pickup_date: row.pickup_date,
                status: row.status,
                created_by: row.created_by,
                clients: [],
                marketer_id: row.marketer_id,
              };
            }

            if (row.client_id) {
              siteVisitsMap[row.id].clients.push({
                id: row.client_id,
                name: row.name,
                email: row.email,
                phone_number: row.phone_number,
              });
            }
          });

          const siteVisitsArray = Object.values(siteVisitsMap);

          res.json(siteVisitsArray);
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching site visit requests.",
      });
    }
  });

  // Update site visit request status
  router.patch(
    "/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isMarketer,
      AccessRoles.isDriver,
    ]),
    async (req, res) => {
      const { status } = req.body;
      const { id } = req.params;

      try {
        connection.query(
          "UPDATE site_visits SET status = ? WHERE id = ?",
          [status, id],
          (err, result) => {
            if (err) throw err;
            if (result.affectedRows === 0) {
              res
                .status(404)
                .json({ message: "Site visit request not found." });
            } else {
              res.json({
                message: "Site visit request status updated successfully.",
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

  // Set site_visit status to "in_progress" when starting a trip
  router.patch(
    "/start-trip/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isMarketer,
      AccessRoles.isDriver,
    ]),
    async (req, res) => {
      const { id } = req.params;

      try {
        connection.query(
          "UPDATE site_visits SET status = 'in_progress' WHERE id = ?",
          [id],
          (err, result) => {
            if (err) throw err;
            if (result.affectedRows === 0) {
              res
                .status(404)
                .json({ message: "Site visit request not found." });
            } else {
              res.json({
                message:
                  "Site visit request status updated to 'in_progress' successfully.",
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

  // Set site_visit status to "complete" when ending a trip
  router.patch(
    "/end-trip/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isMarketer,
      AccessRoles.isDriver,
    ]),
    async (req, res) => {
      const { id } = req.params;
      const driverId = req.user.id;

      try {
        connection.beginTransaction((err) => {
          if (err) throw err;

          // Update site visit status
          connection.query(
            "UPDATE site_visits SET status = 'complete' WHERE id = ?",
            [id],
            (err, result) => {
              if (err) {
                connection.rollback(() => {
                  throw err;
                });
              }

              if (result.affectedRows === 0) {
                res
                  .status(404)
                  .json({ message: "Site visit request not found." });
              } else {
                // Update driver's availability status
                connection.query(
                  "UPDATE users SET is_available = 1 WHERE user_id = ?",
                  [driverId],
                  (err, result) => {
                    if (err) {
                      connection.rollback(() => {
                        throw err;
                      });
                    }

                    connection.commit((err) => {
                      if (err) {
                        connection.rollback(() => {
                          throw err;
                        });
                      }
                      res.json({
                        message:
                          "Site visit request status updated to 'complete' and driver set to 'available' successfully.",
                      });
                    });
                  }
                );
              }
            }
          );
        });
      } catch (error) {
        res.status(500).json({
          message:
            "An error occurred while updating the site visit request status and driver availability.",
        });
      }
    }
  );

  // Delete a site visit request
  router.delete(
    "/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
    ]),
    async (req, res) => {
      const { id } = req.params;

      try {
        connection.beginTransaction((err) => {
          if (err) throw err;

          connection.query(
            "DELETE FROM site_visit_clients WHERE site_visit_id = ?",
            [id],
            (err, result) => {
              if (err) {
                connection.rollback(() => {
                  throw err;
                });
              }

              connection.query(
                "DELETE FROM site_visits WHERE id = ?",
                [id],
                (err, result) => {
                  if (err) {
                    connection.rollback(() => {
                      throw err;
                    });
                  }

                  connection.commit((err) => {
                    if (err) {
                      connection.rollback(() => {
                        throw err;
                      });
                    }

                    if (result.affectedRows === 0) {
                      res
                        .status(404)
                        .json({ message: "Site visit request not found." });
                    } else {
                      res.json({
                        message: "Site visit request deleted successfully.",
                      });
                    }
                  });
                }
              );
            }
          );
        });
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while deleting the site visit request.",
        });
      }
    }
  );

  return router;
};
