const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const AccessRoles = require("../../constants/accessRoles");
const checkPermissions = require("../../middleware/checkPermissions");
const router = express.Router();

module.exports = (connection) => {
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
      } = req.body;
      const query =
        "INSERT INTO vehicle_requests (requester_id, pickup_location, destination_location, pickup_time, pickup_date, number_of_passengers) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(
        query,
        [
          requester_id,
          pickup_location,
          destination_location,
          pickup_time,
          pickup_date,
          number_of_passengers,
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
  router.get(
    "/pending-vehicle-requests",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isDriver,
    ]),
    async (req, res) => {
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
        connection.query(query, (err, results) => {
          if (err) throw err;
          res.status(200).json(results);
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Get a single vehicle request
  router.get(
    "/pending-vehicle-requests/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isDriver,
    ]),
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
      connection.query(query, [id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: "Vehicle request not found." });
        }
      });
    }
  );

  // Approve vehicle request
  router.post(
    "/approve-vehicle-request/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isDriver,
    ]),
    async (req, res) => {
      try {
        const id = req.params.id;
        const query =
          "UPDATE vehicle_requests SET status = 'approved' WHERE id = ?";
        connection.query(query, [id], (err, result) => {
          if (err) throw err;
          if (result.affectedRows > 0) {
            res.status(200).json({ message: "Vehicle request approved." });
          } else {
            res.status(404).json({ message: "Vehicle request not found." });
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Reject vehicle request with a reason
  router.post(
    "/reject-vehicle-request/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isDriver,
    ]),
    async (req, res) => {
      try {
        const id = req.params.id;
        const { rejection_reason } = req.body;
        const query =
          "UPDATE vehicle_requests SET status = 'rejected', rejection_reason = ? WHERE id = ?";
        connection.query(query, [rejection_reason, id], (err, result) => {
          if (err) throw err;
          if (result.affectedRows > 0) {
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

  // Assign vehicle to a request
  router.post(
    "/assign-vehicle-to-request/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isDriver,
    ]),
    async (req, res) => {
      try {
        const request_id = req.params.id;
        const { vehicle_id } = req.body;

        // Check if vehicle request exists and is approved
        const checkRequestQuery =
          "SELECT * FROM vehicle_requests WHERE id = ? AND status = 'approved'";
        connection.query(
          checkRequestQuery,
          [request_id],
          (err, requestResults) => {
            if (err) throw err;
            if (requestResults.length > 0) {
              // Check if the vehicle is available and has enough seats
              const checkVehicleQuery =
                "SELECT number_of_seats FROM vehicles WHERE id = ? AND status = 'available'";
              connection.query(
                checkVehicleQuery,
                [vehicle_id],
                (err, vehicleResults) => {
                  if (err) throw err;
                  if (vehicleResults.length > 0) {
                    const numberOfSeats = vehicleResults[0].number_of_seats;
                    const passengers = requestResults[0].number_of_passengers;
                    if (numberOfSeats >= passengers) {
                      // Update vehicle_id in the vehicle_requests table
                      const updateRequestQuery =
                        "UPDATE vehicle_requests SET vehicle_id = ? WHERE id = ?";
                      connection.query(
                        updateRequestQuery,
                        [vehicle_id, request_id],
                        (err, result) => {
                          if (err) throw err;

                          // Set the vehicle status to unavailable
                          const updateVehicleStatusQuery =
                            "UPDATE vehicles SET status = 'unavailable' WHERE id = ?";
                          connection.query(
                            updateVehicleStatusQuery,
                            [vehicle_id],
                            (err, result) => {
                              if (err) throw err;
                              res.status(200).json({
                                message:
                                  "Vehicle assigned to request successfully.",
                              });
                            }
                          );
                        }
                      );
                    } else {
                      const seatsExceeded = passengers - numberOfSeats;
                      res.status(400).json({
                        message:
                          "The selected vehicle does not have enough seats.",
                        exceeded_by: seatsExceeded,
                      });
                    }
                  } else {
                    res.status(404).json({
                      message: "Available vehicle not found.",
                    });
                  }
                }
              );
            } else {
              res
                .status(404)
                .json({ message: "Approved vehicle request not found." });
            }
          }
        );
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Assign driver to a vehicle request
  router.post(
    "/assign-driver-to-vehicle-request/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isDriver,
    ]),
    async (req, res) => {
      try {
        const request_id = req.params.id;
        const { driver_id } = req.body;

        const checkRequestQuery =
          "SELECT * FROM vehicle_requests WHERE id = ? AND status = 'approved' AND vehicle_id IS NOT NULL";
        connection.query(
          checkRequestQuery,
          [request_id],
          async (err, requestResults) => {
            if (err) throw err;

            if (requestResults.length > 0) {
              const checkDriverAvailabilityQuery =
                "SELECT * FROM users WHERE user_id = ? AND is_available = 1";
              connection.query(
                checkDriverAvailabilityQuery,
                [driver_id],
                async (err, driverResults) => {
                  if (err) throw err;

                  if (driverResults.length > 0) {
                    const updateRequestQuery =
                      "UPDATE vehicle_requests SET driver_id = ? WHERE id = ?";
                    connection.query(
                      updateRequestQuery,
                      [driver_id, request_id],
                      async (err, result) => {
                        if (err) throw err;

                        const updateDriverAvailabilityQuery =
                          "UPDATE users SET is_available = 0 WHERE user_id = ?";
                        connection.query(
                          updateDriverAvailabilityQuery,
                          [driver_id],
                          (err, result) => {
                            if (err) throw err;
                            res.status(200).json({
                              message:
                                "Driver assigned to vehicle request successfully.",
                            });
                          }
                        );
                      }
                    );
                  } else {
                    res
                      .status(400)
                      .json({ message: "Driver is not available." });
                  }
                }
              );
            } else {
              res.status(404).json({
                message:
                  "Approved vehicle request with assigned vehicle not found.",
              });
            }
          }
        );
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // Get vehicles with passengers from vehicle requests and without assigned drivers
  router.get(
    "/vehicles-with-passengers-from-requests",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAchola,
      AccessRoles.isNancy,
      AccessRoles.isKasili,
      AccessRoles.isDriver,
    ]),
    async (req, res) => {
      try {
        const query = `
      SELECT 
      vehicles.*,
      GROUP_CONCAT(vehicle_requests.id) as request_id,
      GROUP_CONCAT(vehicle_requests.pickup_location) as pickup_location,
      GROUP_CONCAT(vehicle_requests.pickup_time) as pickup_time,
      GROUP_CONCAT(vehicle_requests.pickup_date) as pickup_date
    FROM vehicles
    INNER JOIN vehicle_requests
      ON vehicles.id = vehicle_requests.vehicle_id
    WHERE vehicle_requests.status = 'approved' AND vehicle_requests.vehicle_id IS NOT NULL
    GROUP BY vehicles.id
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

  // Start a trip
  router.patch(
    "/start-trip/:id",
    authenticateJWT,
    checkPermissions([AccessRoles.isDriver]),
    async (req, res) => {
      try {
        const requestId = req.params.id;
        const query =
          "UPDATE vehicle_requests SET status = 'in_progress' WHERE id = ?";

        connection.query(query, [requestId], (err, results) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.status(200).json({ message: "Trip started." });
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  // End a trip
  router.patch(
    "/end-trip/:id",
    authenticateJWT,
    checkPermissions([AccessRoles.isDriver]),
    async (req, res) => {
      try {
        const requestId = req.params.id;
        const query =
          "UPDATE vehicle_requests SET status = 'completed' WHERE id = ?";

        connection.query(query, [requestId], (err, results) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.status(200).json({ message: "Trip ended." });
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

  return router;
};
