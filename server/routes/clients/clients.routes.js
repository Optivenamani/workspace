const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // Get all clients added by a certain marketer
  router.get(
    "/clients-by-marketer/:id",
    authenticateJWT,
    async (req, res) => {
      try {
        const marketer_id = req.params.id;
        const query = `
        SELECT 
          site_visit_clients.*, users.fullnames 
        FROM site_visit_clients 
        JOIN site_visits ON site_visit_clients.site_visit_id = site_visits.id 
        JOIN users ON site_visits.marketer_id = users.user_id 
        WHERE site_visits.marketer_id = ?;
      `;
        pool.query(query, [marketer_id], (err, results) => {
          if (err) throw err;
          res.status(200).json(results);
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
  // Get all clients
  router.get(
    "/all",
    authenticateJWT,
    async (req, res) => {
      try {
        const query = `
        SELECT 
          site_visit_clients.*, users.fullnames 
        FROM site_visit_clients 
        JOIN site_visits ON site_visit_clients.site_visit_id = site_visits.id 
        JOIN users ON site_visits.marketer_id = users.user_id 
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
  return router;
};
