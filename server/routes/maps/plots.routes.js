const express = require("express");
const router = express.Router();

module.exports = (pool) => {
      // Retrieve all plot units for a specific project
  router.get("/",  async (req, res) => {

    try {
      pool.query(
        "SELECT * FROM defaultdb.plot_units",
        (err, results) => {
          if (err) throw err;

          res.json(results);
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching plot units.",
      });
    }
    
  });
  // Retrieve all plot units for a specific project
  router.get("/:project_id",  async (req, res) => {
    const { project_id } = req.params;

    try {
      pool.query(
        "SELECT * FROM defaultdb.plot_units WHERE project_id = ?",
        [project_id],
        (err, results) => {
          if (err) throw err;

          res.json(results);
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching plot units.",
      });
    }
    
  });
  // Retrieve a plot unit for a specific project
  router.get("/:Unit_Number",  async (req, res) => {
    const { Unit_Number } = req.params;

    try {
      pool.query(
        "SELECT * FROM defaultdb.plot_units WHERE Unit_Number = ?",
        [Unit_Number],
        (err, results) => {
          if (err) throw err;

          res.json(results);
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching a plot .",
      });
    }
    
  });

  return router;
};
