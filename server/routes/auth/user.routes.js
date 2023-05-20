const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // Retrieve all users
  router.get(
    "/",
    authenticateJWT,
    async (req, res) => {
      try {
        pool.query("SELECT * FROM users", (err, results) => {
          if (err) throw err;

          res.json(results);
        });
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while fetching users.",
        });
      }
    }
  );

  return router;
};
