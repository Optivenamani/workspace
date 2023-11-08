const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Route for the Add event modal
  router.post("/", authenticateJWT, async (req, res) => {
    const { educ_amount, health_amount, environment_amount, poverty_amount } =
      req.body;
    try {
      pool.query(
        "INSERT INTO `allocated_amounts`(`education`, `health`, `environment`, `poverty`, `created_at`) VALUES (0, NULL, NULL, NULL, CURRENT_TIMESTAMP)",
        [educ_amount, health_amount, environment_amount, poverty_amount],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message: "An error occurred while adding the Allocated Amount.",
            });
          }
          res
            .status(201)
            .json({ message: "Allocated Amount added successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the Allocated Amount.",
      });
    }
  });
  //   Route to get latest  Data
  router.get("/", async (req, res) => {
    try {
      pool.query(
        "SELECT * FROM allocated_amounts",
        (err, results) => {
          if (err) throw err;

          res.json(results);
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching Amounts information.",
      });
    }
  });

  // Update an allocation amount
  router.patch("/:id", async (req, res) => {
    const { amount } = req.body;
    const { id } = req.params;

    try {
      pool.query(
        "UPDATE allocated_amounts SET amount = ? WHERE id = ?",
        [amount, id],
        (err, result) => {
          if (err) throw err;

          if (result.affectedRows === 0) {
            res.status(404).json({ message: "Allocated amount not found." });
          } else {
            res.json({
              message: "Allocated amount updated successfully.",
            });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while updating the allocated amount.",
      });
    }
  });

  return router;
};
