const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Route for the Add Poverty Alleviation data modal
  router.post("/", async (req, res) => {
    const {
      pov_name,
      pov_age,
      pov_gender,
      pov_contact,
      pov_amount,
      pov_comment,
      authenticateJWT,
    } = req.body;
    try {
      pool.query(
        "INSERT INTO `poverty`(`pov_name`, `pov_age`, `pov_gender`, `pov_contact`, `pov_amount`, `pov_comment`) VALUES (?, ?, ?, ?, ?, ?)",
        [
            pov_name,
            pov_age,
            pov_gender,
            pov_contact,
            pov_amount,
            pov_comment,
        ],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message: "An error occurred while adding the Poverty Alleviation Project.",
            });
          }
          res
            .status(201)
            .json({ message: "Poverty Alleviation Project added successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the Poverty Alleviation Project.",
      });
    }
  });
  //   Route to get Poverty Alleviation data Data
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM poverty", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the Poverty Alleviation Project",
      });
    }
  });

  return router;
};
