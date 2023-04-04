const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  // Any additional logout functionality you want to perform on the server-side
  res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
