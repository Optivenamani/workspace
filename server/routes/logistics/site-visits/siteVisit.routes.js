// Load required modules and environment variables
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

const WATI_TOKEN = process.env.WATI_TOKEN;
const WATI_BASE_URL = process.env.WATI_BASE_URL;

// WATI Helper function to send the WhatsApp msg
const sendWhatsAppMessage = async (
  phoneNumber,
  templateName,
  parameters,
  broadcastName
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${WATI_TOKEN}`,
    },
  };
  const bodyData = {
    parameters: parameters,
    template_name: templateName,
    broadcast_name: broadcastName,
  };
  try {
    const response = await axios.post(
      `${WATI_BASE_URL}/api/v1/sendTemplateMessage?whatsappNumber=${phoneNumber}`,
      bodyData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error.message);
    throw error;
  }
};

module.exports = (pool, io) => {
  // Create a new site visit request
  router.post("/", authenticateJWT, async (req, res) => {
    const {
      project_id,
      pickup_location,
      pickup_time,
      pickup_date,
      clients,
      status,
      special_assignment_destination,
      special_assignment_assigned_to,
      remarks,
      driver_id,
      vehicle_id,
    } = req.body;
    const marketer_id = req.body.marketer_id; // Get the authenticated user ID from the JWT

    // Validation for client information
    if (!clients || clients.length === 0) {
      return res.status(400).json({
        message: "Client information is mandatory.",
      });
    }

    for (const client of clients) {
      if (!client.name || !client.phone_number) {
        return res.status(400).json({
          message: "Name and phone number are required for each client.",
        });
      }
    }

    try {
      // Insert the site visit request into the `site_visits` table
      pool.query(
        `INSERT INTO site_visits 
          (
            marketer_id, 
            project_id, 
            pickup_location, 
            pickup_time, 
            pickup_date, 
            status,
            special_assignment_destination,
            special_assignment_assigned_to,
            remarks,
            driver_id,
            vehicle_id
          ) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          marketer_id,
          project_id,
          pickup_location,
          pickup_time,
          pickup_date,
          status,
          special_assignment_destination,
          special_assignment_assigned_to,
          remarks,
          driver_id,
          vehicle_id,
        ],
        (err, result) => {
          if (err) throw err;

          const siteVisitId = result.insertId; // Get the site_visit_id of the created site visit request

          // Insert clients associated with this site visit request into the `site_visit_clients` table
          const clientValues = clients.map((client) => [
            siteVisitId,
            client.name,
            client.email,
            client.phone_number,
          ]);
          pool.query(
            `INSERT INTO site_visit_clients 
              (
                site_visit_id, 
                name, 
                email, 
                phone_number
              ) 
             VALUES ?`,
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
  // Edit a site visit request
  router.patch("/:id", authenticateJWT, async (req, res) => {
    try {
      const { id } = req.params;
      const { project_id, pickup_location, pickup_time, pickup_date, clients } =
        req.body;

      // Validation for client information
      if (!clients || clients.length === 0) {
        return res.status(400).json({
          message: "Client information is mandatory.",
        });
      }

      for (const client of clients) {
        if (!client.name || !client.phone_number) {
          return res.status(400).json({
            message: "Name and phone number are required for each client.",
          });
        }
      }

      // Update the site visit request in the `site_visits` table
      const updateQuery = `
      UPDATE site_visits
      SET 
        project_id = ?,
        pickup_location = ?, 
        pickup_time = ?, 
        pickup_date = ?
      WHERE id = ? AND status = 'pending'
    `;

      pool.query(
        updateQuery,
        [project_id, pickup_location, pickup_time, pickup_date, id],
        (err, result) => {
          if (err) {
            res.status(500).json({
              message:
                "An error occurred while updating the site visit request.",
            });
            return;
          }

          if (result.affectedRows === 0) {
            res.status(404).json({
              message: "Site visit request not found or cannot be updated.",
            });
            return;
          }

          // Delete existing clients associated with this site visit request from the `site_visit_clients` table
          const deleteClientsQuery = `
          DELETE FROM site_visit_clients
          WHERE site_visit_id = ?
        `;

          pool.query(deleteClientsQuery, [id], (err, deleteResult) => {
            if (err) {
              res.status(500).json({
                message:
                  "An error occurred while deleting existing client information.",
              });
              return;
            }

            // Insert updated clients associated with this site visit request into the `site_visit_clients` table
            const clientValues = clients.map((client) => [
              id,
              client.name,
              client.email,
              client.phone_number,
            ]);

            const insertClientsQuery = `
            INSERT INTO site_visit_clients 
              (
                site_visit_id, 
                name, 
                email, 
                phone_number
              ) 
             VALUES ?
          `;

            pool.query(
              insertClientsQuery,
              [clientValues],
              (err, insertResult) => {
                if (err) {
                  res.status(500).json({
                    message:
                      "An error occurred while inserting updated client information.",
                  });
                  return;
                }

                res.status(200).json({
                  message: "Site visit request updated successfully!",
                });
              }
            );
          });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while updating the site visit request.",
      });
    }
  });
  // Set site_visit status to "in_progress" when starting a trip
  router.patch("/start-trip/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
      pool.query(
        "UPDATE site_visits SET status = 'in_progress' WHERE id = ?",
        [id],
        (err, result) => {
          if (err) throw err;
          if (result.affectedRows === 0) {
            res.status(404).json({ message: "Site visit request not found." });
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
  });
  // Set site_visit status to "complete" when ending a trip
  router.patch("/end-trip/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const driverId = req.user.id;

    const sendCompletionNotification = async () => {
      const getUserIdQuery = "SELECT marketer_id FROM site_visits WHERE id = ?";
      pool.query(getUserIdQuery, [id], async (err, userIdResult) => {
        if (err) throw err;
        if (userIdResult.length > 0) {
          const userId = userIdResult[0].marketer_id;
          const notificationQuery = `
              INSERT INTO notifications (user_id, type, message, remarks, site_visit_id)
              VALUES (?, 'completed', 'Your site visit has been completed', 'The site visit has been marked as complete by the driver', ?);
            `;
          pool.query(notificationQuery, [userId, id], async (err, result) => {
            if (err) throw err;

            // Send WhatsApp message to clients
            const getClientPhoneNumbersQuery =
              "SELECT phone_number FROM site_visit_clients WHERE site_visit_id = ?";
            pool.query(
              getClientPhoneNumbersQuery,
              [id],
              async (err, phoneNumbersResult) => {
                if (err) throw err;
                if (phoneNumbersResult.length > 0) {
                  const clientPhoneNumbers = phoneNumbersResult.map(
                    (item) => item.phone_number
                  );
                  const completionMessage =
                    "Your site visit has been completed.";
                  const templateName = "site_visit_completed";
                  const parameters = [
                    { name: "message", value: completionMessage },
                  ];
                  const broadcastName = "site_visit_completed";

                  try {
                    // Send WhatsApp messages to all client phone numbers
                    for (const phoneNumber of clientPhoneNumbers) {
                      await sendWhatsAppMessage(
                        phoneNumber,
                        templateName,
                        parameters,
                        broadcastName
                      );
                    }
                  } catch (error) {
                    console.error("Failed to send WhatsApp message:", error);
                  }
                }
              }
            );

            // Emit the notification via Socket.IO
            io.emit("siteVisitCompleted", {
              id: req.params.id,
              message: "Site visit has been completed",
            });
          });
        }
      });
    };

    pool.getConnection((err, connection) => {
      if (err) {
        return res.status(500).json({
          message:
            "An error occurred while establishing the database connection.",
        });
      }

      connection.beginTransaction(async (err) => {
        if (err) {
          connection.release();
          return res.status(500).json({
            message: "An error occurred while beginning the transaction.",
          });
        }

        try {
          // Update site visit status
          connection.query(
            "UPDATE site_visits SET status = 'complete' WHERE id = ?",
            [id],
            async (err, result) => {
              if (err) {
                connection.rollback(() => {
                  connection.release();
                  return res.status(500).json({
                    message:
                      "An error occurred while updating the site visit request status.",
                  });
                });
              }

              if (result.affectedRows === 0) {
                connection.release();
                return res
                  .status(404)
                  .json({ message: "Site visit request not found." });
              } else {
                await sendCompletionNotification();

                // Update driver's availability status
                connection.query(
                  "UPDATE users SET is_available = 1 WHERE user_id = ?",
                  [driverId],
                  (err, result) => {
                    if (err) {
                      connection.rollback(() => {
                        connection.release();
                        return res.status(500).json({
                          message:
                            "An error occurred while updating the driver availability.",
                        });
                      });
                    }

                    connection.commit((err) => {
                      if (err) {
                        connection.rollback(() => {
                          connection.release();
                          return res.status(500).json({
                            message:
                              "An error occurred while committing the transaction.",
                          });
                        });
                      }
                      connection.release();
                      return res.json({
                        message:
                          "Site visit request status updated to 'complete', driver set to 'available', and notification sent successfully.",
                      });
                    });
                  }
                );
              }
            }
          );
        } catch (error) {
          connection.rollback(() => {
            connection.release();
            return res.status(500).json({
              message:
                "An error occurred while updating the site visit request status and driver availability.",
            });
          });
        }
      });
    });
  });
  return router;
};
