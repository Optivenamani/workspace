const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // Input new interview information
  router.post("/", async (req, res) => {
    const {
      name,
      email,
      phone_number,
      interview_date,
      interview_time,
      position,
    } = req.body;

    try {
      pool.query(
        "INSERT INTO interviewees (name, email, phone_number, interview_date, interview_time, position) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, phone_number, interview_date, interview_time, position],
        (err, result) => {
          if (err) throw err;

          res
            .status(201)
            .json({ message: "Interview information added successfully." });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the interview information.",
      });
    }
  });

  // Retrieve all interview information
  router.get("/", async (req, res) => {
    try {
      pool.query(
        "SELECT * FROM interviewees ORDER BY id DESC",
        (err, results) => {
          if (err) throw err;

          res.json(results);
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching interview information.",
      });
    }
  });

  // Retrieve a single interview information by id
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      pool.query(
        "SELECT * FROM interviewees WHERE id = ?",
        [id],
        (err, results) => {
          if (err) throw err;

          if (results.length === 0) {
            res
              .status(404)
              .json({ message: "Interview information not found." });
          } else {
            const interview = results[0];

            res.json(interview);
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the interview information.",
      });
    }
  });

  // Update an interview
  router.patch("/:id", async (req, res) => {
    const {
      name,
      email,
      phone_number,
      interview_date,
      interview_time,
      position,
    } = req.body;
    const { id } = req.params;

    try {
      pool.query(
        "UPDATE interviewees SET name = ?, email = ?, phone_number = ?, interview_date = ?, interview_time = ?, position = ? WHERE id = ?",
        [
          name,
          email,
          phone_number,
          interview_date,
          interview_time,
          position,
          id,
        ],
        (err, result) => {
          if (err) throw err;

          if (result.affectedRows === 0) {
            res.status(404).json({ message: "Interview not found." });
          } else {
            res.json({
              message: "Interview updated successfully.",
            });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while updating the interview.",
      });
    }
  });

  // Delete an interview
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      pool.query(
        "DELETE FROM interviewees WHERE id = ?",
        [id],
        (err, result) => {
          if (err) throw err;

          if (result.affectedRows === 0) {
            res.status(404).json({ message: "Interview not found." });
          } else {
            res.json({ message: "Interview deleted successfully." });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while deleting the interview.",
      });
    }
  });

  return router;
};
