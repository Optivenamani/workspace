const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (connection) => {
  // Get all sites
  router.get(
    "/",
    authenticateJWT,
    async (req, res) => {
      try {
        connection.query("SELECT * FROM Projects", (err, results) => {
          if (err) throw err;
          res.json(results);
        });
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while fetching sites.",
        });
      }
    }
  );
  
  return router;
};
