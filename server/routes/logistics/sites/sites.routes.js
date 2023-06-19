const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // Get all sites
  router.get(
    "/",
    authenticateJWT,
    async (req, res) => {
      try {
        pool.query("SELECT * FROM Projects ORDER BY name ASC", (err, results) => {
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
