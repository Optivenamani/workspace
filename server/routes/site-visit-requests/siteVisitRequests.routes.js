const express = require("express");
const pdfMakePrinter = require('pdfmake/src/printer');
const authenticateJWT = require("../../middleware/authenticateJWT");
const AccessRoles = require("../../constants/accessRoles");
const checkPermissions = require("../../middleware/checkPermissions");
const router = express.Router();

// Define your fonts
var fonts = {
  Roboto: {
    normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
    bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
    italic: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
    bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
  }
};

// Create a new printer with the fonts
var printer = new pdfMakePrinter(fonts);

// Define your dataToPdfRows function
function dataToPdfRows(data) {
  return data.map((item, index) => {
    const date = new Date(item.pickup_date);
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return [
      { text: index + 1 ?? '', style: 'tableCell' },
      { text: formattedDate ?? '', style: 'tableCell' },
      { text: item.marketer_name ?? '', style: 'tableCell' },
      { text: item.num_clients ?? '', style: 'tableCell' },
      { text: item.site_name ?? '', style: 'tableCell' },
      { text: item.driver_name ?? '', style: 'tableCell' },
      { text: item.pickup_time ?? '', style: 'tableCell' },
      { text: item.vehicle_name ?? '', style: 'tableCell' },
      { text: item.pickup_location ?? '', style: 'tableCell' },
      { text: item.remarks ?? '', style: 'tableCell' },
    ]
  });
}

module.exports = (pool, io) => {
  // Get single site visit with driver, vehicle info, and all associated clients
  router.get(
    "/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isBrian
    ]),
    async (req, res) => {
      try {
        const siteVisitQuery = `
        SELECT 
          site_visits.*,
          Projects.name AS site_name,
          users.fullnames as marketer_name,
          drivers.fullnames as driver_name,
          vehicles.vehicle_registration as vehicle_name
        FROM site_visits
        LEFT JOIN Projects
          ON site_visits.project_id = Projects.project_id
        LEFT JOIN users
          ON site_visits.marketer_id = users.user_id
        LEFT JOIN users as drivers
          ON site_visits.driver_id = drivers.user_id
        LEFT JOIN vehicles
          ON site_visits.vehicle_id = vehicles.id
        WHERE site_visits.id = ?
        ORDER BY site_visits.created_at DESC;
      `;
        pool.query(siteVisitQuery, [req.params.id], async (err, results) => {
          if (err) throw err;
          if (results.length > 0) {
            const siteVisit = results[0];
            const clientsQuery = `
            SELECT 
              site_visit_clients.name as client_name,
              site_visit_clients.email as client_email,
              site_visit_clients.phone_number as client_phone
            FROM site_visit_clients
            WHERE site_visit_clients.site_visit_id = ?
          `;
            pool.query(clientsQuery, [req.params.id], (err, results) => {
              if (err) throw err;
              siteVisit.clients = results;
              res.status(200).json(siteVisit);
            });
          } else {
            res.status(404).json({ message: "Site visit not found" });
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  // Get all site visits with driver and vehicle info
  router.get(
    "/",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isBrian
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
        pool.query(query, (err, results) => {
          if (err) throw err;
          res.status(200).json(results);
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  // Download the site visit info in a pdf
  router.get(
    "/download-pdf/download",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isBrian
    ]),
    async (req, res) => {
      try {
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
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
          WHERE site_visits.status = 'approved'
            AND site_visits.pickup_date BETWEEN ? AND ?
          GROUP BY site_visits.id
          ORDER BY site_visits.created_at DESC;
        `;
        pool.query(query, [startDate, endDate], (err, results) => {
          if (err) throw err;
          const docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'landscape',
            content: [
              {
                table: {
                  headerRows: 1,
                  widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                  body: [
                    [
                      { text: 'Index', fillColor: '#BBD4E1', style: 'tableHeader' },
                      { text: 'Pickup Date', fillColor: '#BBD4E1', style: 'tableHeader' },
                      { text: 'Converter', fillColor: '#BBD4E1', style: 'tableHeader' },
                      { text: 'Number of Clients', fillColor: '#BBD4E1', style: 'tableHeader' },
                      { text: 'Site', fillColor: '#BBD4E1', style: 'tableHeader' },
                      { text: 'Driver', fillColor: '#BBD4E1', style: 'tableHeader' },
                      { text: 'Pickup Time', fillColor: '#BBD4E1', style: 'tableHeader' },
                      { text: 'Vehicle Reg No', fillColor: '#BBD4E1', style: 'tableHeader' },
                      { text: 'Pickup Location', fillColor: '#BBD4E1', style: 'tableHeader' },
                      { text: 'Admin Remarks', fillColor: '#BBD4E1', style: 'tableHeader' },
                    ],
                  ],
                },
                layout: {
                  hLineWidth: function (i, node) {
                    return 0;
                  },
                  vLineWidth: function (i, node) {
                    return 0;
                  },
                  fillColor: function (rowIndex, node, columnIndex) {
                    return (rowIndex % 2 === 0) ? '#D3D3D3' : null;
                  },
                },
              },
            ],
            styles: {
              tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'white',
              },
              tableBody: {
                italic: true,
              },
            },
          };
          // Populate the body array with your data
          docDefinition.content[0].table.body.push(...dataToPdfRows(results));
          // Create the PDF and send it as a response
          const pdfDoc = printer.createPdfKitDocument(docDefinition);
          res.setHeader('Content-Type', 'application/pdf');
          pdfDoc.pipe(res);
          pdfDoc.end();
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  // Get info on the user, to see if he's booked any active site-visits
  router.get("/active", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const query = `
        SELECT
          site_visits.*,
          users.fullnames as marketer_name
        FROM site_visits
        JOIN users ON site_visits.marketer_id = users.user_id
        WHERE site_visits.marketer_id = ? AND (site_visits.status != 'complete' AND site_visits.status != 'rejected' AND site_visits.status != 'reviewed' AND site_visits.status != 'cancelled');
        `;
      pool.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.status(200).json(results);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // Get a single pending site visit request
  router.get(
    "/pending-site-visits/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isBrian
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
      pool.query(query, [id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: "Site visit request not found." });
        }
      });
    }
  );
  // Cancel a site visit request
  router.patch(
    "/cancel-site-visit/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isMarketer,
    ]),
    async (req, res) => {
      try {
        const { id } = req.params;

        const updateSiteVisitStatusQuery = `
        UPDATE site_visits
        SET status = 'cancelled'
        WHERE id = ? AND status IN ('pending')
      `;

        pool.query(updateSiteVisitStatusQuery, [id], (err, result) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          if (result.affectedRows > 0) {
            res
              .status(200)
              .json({ message: "Site visit request cancelled successfully." });
          } else {
            res.status(400).json({
              message:
                "Invalid site visit ID or the site visit has already been completed or cancelled.",
            });
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
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
      AccessRoles.isBrian
    ]),
    async (req, res) => {
      try {
        const id = req.params.id;
        const { remarks } = req.body;
        const query =
          "UPDATE site_visits SET status = 'rejected', remarks = ?, vehicle_id = null, driver_id = null WHERE id = ?";
        pool.query(query, [remarks, id], async (err, result) => {
          if (err) throw err;
          if (result.affectedRows > 0) {
            // Get the user_id from the site_visits table
            const getUserIdQuery =
              "SELECT marketer_id FROM site_visits WHERE id = ?";
            pool.query(getUserIdQuery, [id], async (err, userIdResult) => {
              if (err) throw err;
              if (userIdResult.length > 0) {
                const userId = userIdResult[0].marketer_id;
                // Insert a record into the notifications table
                const notificationQuery = `
                INSERT INTO notifications (user_id, type, message, remarks)
                VALUES (?, 'rejected', 'Your site visit request has been rejected :(', ?);
              `;
                pool.query(
                  notificationQuery,
                  [userId, remarks],
                  (err, result) => {
                    if (err) throw err;
                    // Emit the notification via Socket.IO
                    io.emit("siteVisitRejected", {
                      id: req.params.id,
                      message: "Site visit request rejected",
                    });
                  }
                );
              }
            });

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
      AccessRoles.isBrian
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

        const updateAndSendNotification = async () => {
          if (status === "approved") {
            // Get the user_id from the site_visits table
            const getUserIdQuery =
              "SELECT marketer_id FROM site_visits WHERE id = ?";
            pool.query(getUserIdQuery, [id], async (err, userIdResult) => {
              if (err) throw err;
              if (userIdResult.length > 0) {
                const userId = userIdResult[0].marketer_id;
                // Insert a record into the notifications table
                const notificationQuery = `
                  INSERT INTO notifications 
                    (user_id, type, message, remarks, site_visit_id)
                  VALUES (?, 'approved', 'Your site visit request has been approved!', ?, ?);
                  `;
                pool.query(
                  notificationQuery,
                  [userId, remarks, id], // id added here
                  (err, result) => {
                    if (err) throw err;
                    // Emit the notification via Socket.IO
                    io.emit("siteVisitApproved", {
                      id: req.params.id,
                      message: "Site visit request approved",
                    });
                  }
                );
              }
            });
          }
        };

        if (vehicle_id) {
          // Check if the vehicle is available and has enough seats
          const checkVehicleQuery = `SELECT 
            number_of_seats, 
            passengers_assigned 
          FROM vehicles 
          WHERE id = ? AND status = 'available'`;
          pool.query(checkVehicleQuery, [vehicle_id], (err, vehicleResults) => {
            if (err) throw err;
            if (vehicleResults.length > 0) {
              const numberOfSeats = vehicleResults[0].number_of_seats;
              const passengersAssigned = vehicleResults[0].passengers_assigned;
              const checkClientsQuery = `SELECT COUNT(*) as client_count
                FROM site_visit_clients 
                WHERE site_visit_id = ?`;
              pool.query(checkClientsQuery, [id], (err, clientResults) => {
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

                  pool.query(
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

                      await updateAndSendNotification();

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

                      pool.query(
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
                    message: "The selected vehicle does not have enough seats.",
                    exceeded_by: seatsExceeded,
                  });
                }
              });
            } else {
              res.status(404).json({
                message: "Available vehicle not found.",
              });
            }
          });
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
          pool.query(
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
            async (err, results) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }

              await updateAndSendNotification();

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
  // Submit a survey for a completed site visit
  router.post(
    "/submit-survey/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isMarketer,
    ]),
    async (req, res) => {
      try {
        const siteVisitId = req.params.id;
        const userId = req.user.id;
        const {
          amount_reserved,
          booked,
          plot_details,
          reason_not_visited,
          reason_not_booked,
          visited,
        } = req.body;

        const checkSiteVisitQuery = `
        SELECT *
        FROM site_visits
        WHERE id = ? AND status = 'complete' AND marketer_id = ?
      `;
        pool.query(
          checkSiteVisitQuery,
          [siteVisitId, userId],
          (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
              const insertSurveyQuery = `
            INSERT INTO site_visit_surveys (
              site_visit_id, 
              amount_reserved,
              booked,
              plot_details,
              reason_not_visited,
              reason_not_booked,
              visited
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
              pool.query(
                insertSurveyQuery,
                [
                  siteVisitId,
                  amount_reserved,
                  booked,
                  plot_details,
                  reason_not_visited,
                  reason_not_booked,
                  visited,
                ],
                (err, result) => {
                  if (err) throw err;

                  // Update the site visit status to 'reviewed'
                  const updateSiteVisitStatusQuery = `
                UPDATE site_visits
                SET status = 'reviewed'
                WHERE id = ?
              `;
                  pool.query(
                    updateSiteVisitStatusQuery,
                    [siteVisitId],
                    (err, result) => {
                      if (err) throw err;
                      res
                        .status(201)
                        .json({ message: "Survey submitted successfully." });
                    }
                  );
                }
              );
            } else {
              res.status(400).json({ message: "Invalid site visit or user." });
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
