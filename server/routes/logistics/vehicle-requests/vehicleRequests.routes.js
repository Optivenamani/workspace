const express = require("express");
const nodemailer = require("nodemailer");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

// Nodemailer helper function to send email
async function sendEmail(userEmail, subject, text) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "notify@optiven.co.ke", // your domain email account
      pass: "Peace@6t4r#!", // your domain email password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Optiven Logistics 🚌" <notify@optiven.co.ke>', // sender address
    to: userEmail, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
  });
}

module.exports = (pool) => {
  // Create a vehicle request
  router.post("/create-vehicle-request", authenticateJWT, async (req, res) => {
    try {
      const {
        requester_id,
        pickup_location,
        destination_location,
        pickup_time,
        pickup_date,
        number_of_passengers,
        purpose,
      } = req.body;
      const query = `INSERT INTO vehicle_requests (requester_id, pickup_location, destination_location, pickup_time, pickup_date, number_of_passengers, purpose) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      pool.query(
        query,
        [
          requester_id,
          pickup_location,
          destination_location,
          pickup_time,
          pickup_date,
          number_of_passengers,
          purpose,
        ],
        (err, result) => {
          if (err) throw err;
          res
            .status(201)
            .json({ message: "Vehicle request created successfully." });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // Get all pending vehicle requests
  router.get("/pending-vehicle-requests", authenticateJWT, async (req, res) => {
    try {
      const query = `
        SELECT 
          vehicle_requests.*,
          users.fullnames AS requester_name
        FROM vehicle_requests
        LEFT JOIN users
          ON vehicle_requests.requester_id = users.user_id
        WHERE vehicle_requests.status = 'pending'
        ORDER BY vehicle_requests.created_at ASC
      `;
      pool.query(query, (err, results) => {
        if (err) throw err;
        res.status(200).json(results);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // Get a single vehicle request
  router.get(
    "/pending-vehicle-requests/:id",
    authenticateJWT,
    async (req, res) => {
      const id = req.params.id;
      const query = `
      SELECT
        vehicle_requests.*,
        users.fullnames AS requester_name,
        vehicles.make AS vehicle_make,
        vehicles.model AS vehicle_model,
        driver.fullnames AS driver_name
      FROM vehicle_requests
      LEFT JOIN users
        ON vehicle_requests.requester_id = users.user_id
      LEFT JOIN vehicles
        ON vehicle_requests.vehicle_id = vehicles.id
      LEFT JOIN users AS driver
        ON vehicle_requests.driver_id = driver.user_id
      WHERE vehicle_requests.id = ?;
    `;
      pool.query(query, [id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: "Vehicle request not found." });
        }
      });
    }
  );
  // Get all vehicle requests of a user by user_id
  router.get(
    "/user-vehicle-requests/:id",
    authenticateJWT,
    async (req, res) => {
      try {
        const user_id = req.params.id;
        const query = `
      SELECT 
        vehicle_requests.*,
        users.fullnames AS requester_name
      FROM vehicle_requests
      LEFT JOIN users
        ON vehicle_requests.requester_id = users.user_id
      WHERE vehicle_requests.requester_id = ?
      ORDER BY vehicle_requests.created_at DESC
    `;
        pool.query(query, [user_id], (err, results) => {
          if (err) throw err;
          res.status(200).json(results);
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  // Get all vehicle requests
  router.get("/all-vehicle-requests", authenticateJWT, async (req, res) => {
    try {
      const query = `
        SELECT 
          vehicle_requests.*,
          users.fullnames AS requester_name,
          vehicles.make AS vehicle_make,
          vehicles.model AS vehicle_model,
          vehicles.vehicle_registration,
          vehicles.status AS vehicle_status,
          driver.fullnames AS driver_name
        FROM vehicle_requests
        LEFT JOIN users
          ON vehicle_requests.requester_id = users.user_id
        LEFT JOIN vehicles
          ON vehicle_requests.vehicle_id = vehicles.id
        LEFT JOIN users AS driver
          ON vehicle_requests.driver_id = driver.user_id
        ORDER BY vehicle_requests.created_at ASC
      `;
      pool.query(query, (err, results) => {
        if (err) throw err;
        res.status(200).json(results);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // Get active vehicle requests by a user
  router.get("/active/active", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const query = `
      SELECT
        vehicle_requests.*,
        users.fullnames as requester_name,
        vehicle_requests.status as vehicle_request_status
      FROM vehicle_requests
      JOIN users ON vehicle_requests.requester_id = users.user_id
      WHERE vehicle_requests.requester_id = ? AND (vehicle_requests.status != 'completed' AND vehicle_requests.status != 'rejected');
      `;
      pool.query(query, [userId], (err, results) => {
        if (err) throw err;
        res.status(200).json(results);
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // Approve and edit vehicle request
  router.patch(
    "/pending-vehicle-requests/:id",
    authenticateJWT,
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
          destination_location,
        } = req.body;

        // Update vehicle request
        const query = `
        UPDATE vehicle_requests
        SET 
          vehicle_id = ?,
          pickup_location = ?, 
          pickup_date = ?, 
          pickup_time = ?, 
          remarks = ?, 
          status = ?, 
          driver_id = ?,
          destination_location = ?
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
            destination_location,
            id,
          ],
          async (err, results) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }

            // Send an email to the requester
            const getEmailQuery = "SELECT email FROM users WHERE user_id = ?";
            pool.query(
              getEmailQuery,
              [req.user.id],
              async (err, emailResult) => {
                if (err) {
                  res.status(500).json({ error: err.message });
                  return;
                }

                if (emailResult.length > 0) {
                  const userEmail = emailResult[0].email;
                  await sendEmail(
                    userEmail,
                    "Vehicle Request Approved",
                    "Greetings,\n\nYour vehicle request has been approved!😃\nPlease check the app for more details.\n\nKind regards,\nOptiven ICT Team"
                  );
                }
              }
            );

            // Send an email to the driver
            const getDriverEmailQuery =
              "SELECT email FROM users WHERE user_id = ?";
            pool.query(
              getDriverEmailQuery,
              [driver_id],
              async (err, driverEmailResult) => {
                if (err) {
                  res.status(500).json({ error: err.message });
                  return;
                }

                if (driverEmailResult.length > 0) {
                  const driverEmail = driverEmailResult[0].email;
                  await sendEmail(
                    driverEmail,
                    "Vehicle Request Assignment",
                    "Greetings,\n\nYou have been assigned to a vehicle request.\nPlease check the app for more details.\n\nKind regards,\nOptiven ICT Team"
                  );
                }
              }
            );

            // New SELECT query to get the updated vehicle request
            const updatedVehicleRequestQuery = `
            SELECT *
            FROM vehicle_requests
            WHERE id = ?
          `;

            pool.query(
              updatedVehicleRequestQuery,
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
                    message: "Updated vehicle request not found.",
                  });
                }
              }
            );
          }
        );
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  // Reject vehicle request with a reason
  router.patch(
    "/reject-vehicle-request/:id",
    authenticateJWT,
    async (req, res) => {
      try {
        const id = req.params.id;
        const { remarks } = req.body;
        const query = `
        UPDATE vehicle_requests 
        SET 
          status = 'rejected', 
          remarks = ?, 
          driver_id = NULL, 
          vehicle_id = NULL 
        WHERE id = ?
      `;
        pool.query(query, [remarks, id], async (err, result) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          if (result.affectedRows > 0) {
            // Send an email to the requester
            const getEmailQuery = "SELECT email FROM users WHERE user_id = ?";
            pool.query(
              getEmailQuery,
              [req.user.id],
              async (err, emailResult) => {
                if (err) {
                  res.status(500).json({ error: err.message });
                  return;
                }

                if (emailResult.length > 0) {
                  const userEmail = emailResult[0].email;
                  await sendEmail(
                    userEmail,
                    "Vehicle Request Rejected",
                    "Greetings,\n\nYour vehicle request has been rejected. 😔 \n Please check the app for more details. \n\n Kind regards,\nOptiven ICT Department"
                  );
                }
              }
            );

            res.status(200).json({ message: "Vehicle request rejected." });
          } else {
            res.status(404).json({ message: "Vehicle request not found." });
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  // Start a trip
  router.patch("/start-trip/:id", authenticateJWT, async (req, res) => {
    try {
      const requestId = req.params.id;
      const query =
        "UPDATE vehicle_requests SET status = 'in_progress' WHERE id = ?";

      pool.query(query, [requestId], (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.status(200).json({ message: "Trip started." });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  // End a trip
  router.patch("/end-trip/:id", authenticateJWT, async (req, res) => {
    try {
      const requestId = req.params.id;
      const updateRequestQuery =
        "UPDATE vehicle_requests SET status = 'completed' WHERE id = ?";
      const getRequestInfoQuery =
        "SELECT driver_id, vehicle_id FROM vehicle_requests WHERE id = ?";

      pool.query(getRequestInfoQuery, [requestId], (err, results) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        const driverId = results[0].driver_id;
        const vehicleId = results[0].vehicle_id;

        pool.query(updateRequestQuery, [requestId], (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          const makeDriverAvailableQuery =
            "UPDATE users SET is_available = 1 WHERE user_id = ?";
          pool.query(makeDriverAvailableQuery, [driverId], (err) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }

            // Make the vehicle available again
            const makeVehicleAvailableQuery =
              "UPDATE vehicles SET status = 'available' WHERE id = ?";
            pool.query(makeVehicleAvailableQuery, [vehicleId], (err) => {
              if (err) {
                res.status(500).json({ error: err.message });
                return;
              }
              res.status(200).json({
                message: "Trip ended, driver and vehicle made available again.",
              });
            });
          });
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  return router;
};
