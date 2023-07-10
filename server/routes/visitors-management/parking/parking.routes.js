const express = require("express");
const router = express.Router();
const authenticateJWT = require("../../../middleware/authenticateJWT");

// Sample data for reserved parking
let reservedParking = [
  {
    id: 1,
    name: "John Doe",
    vehicleRegistration: "ABC123",
    estimatedArrivalTime: "2023-07-10T10:00:00Z",
  },
  // Add more reserved parking data as needed
];

// Route: Reserve parking
router.post("/",  (req, res) => {
  const { name, vehicle_registration, arrival_time } = req.body;

  // Generate a unique ID for the new reservation
  const id = reservedParking.length + 1;

  // Create a new reservation object
  const newReservation = {
    id,
    name,
    vehicle_registration,
    arrival_time,
  };

  // Add the new reservation to the list
  reservedParking.push(newReservation);

  res.status(200).json({ message: "Parking reserved successfully." });
});

// Route: View all parking reservations
router.get("/",  (req, res) => {
  res.status(200).json(reservedParking);
});

// Route: Get a single parking reservation by ID
router.get("/:id",  (req, res) => {
  const id = parseInt(req.params.id);

  // Find the reservation with the matching ID
  const reservation = reservedParking.find((parking) => parking.id === id);

  if (reservation) {
    res.status(200).json(reservation);
  } else {
    res.status(404).json({ message: "Parking reservation not found." });
  }
});

// Route: Update a parking reservation by ID
router.put("/:id",  (req, res) => {
  const id = parseInt(req.params.id);
  const { name, vehicle_registration, arrival_time } = req.body;

  // Find the reservation with the matching ID
  const reservation = reservedParking.find((parking) => parking.id === id);

  if (reservation) {
    // Update the reservation details
    reservation.name = name;
    reservation.vehicleRegistration = vehicle_registration;
    reservation.estimatedArrivalTime = arrival_time;

    res.status(200).json({ message: "Parking reservation updated successfully." });
  } else {
    res.status(404).json({ message: "Parking reservation not found." });
  }
});

// Route: Download parking information as a file
router.get("/download",  (req, res) => {
  const parkingData = JSON.stringify(reservedParking, null, 2);

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=parking_data.json");
  res.send(parkingData);
});

module.exports = router;
