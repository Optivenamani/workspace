const express = require("express");
const router = express.Router();
const authenticateRoles = require("../middlewares/authenticateRoles");

// Route that requires authentication and only allows "staff" and "sales manager" roles
router.get(
  "/sales",
  authenticateRoles(["staff", "sales manager"]),
  (req, res) => {
    // Do something
  }
);

module.exports = router;
