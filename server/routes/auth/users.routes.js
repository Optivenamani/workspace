const express = require("express");
// const authenticateJWT = require("../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool) => {
  // Create a new user
  router.post("/", async (req, res) => {
    const {
      category,
      office,
      department,
      fullnames,
      email,
      password,
      title,
      status,
      date,
      reset_code,
      role,
      Accessrole,
      user_group,
      reset_date,
      is_available,
      phone_number,
    } = req.body;

    try {
      pool.query(
        "INSERT INTO users (category, office, department, fullnames, email, password, title, status, date, reset_code, role, Accessrole, user_group, reset_date, is_available, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          category,
          office,
          department,
          fullnames,
          email,
          password,
          title,
          status,
          date,
          reset_code,
          role,
          Accessrole,
          user_group,
          reset_date,
          is_available,
          phone_number,
        ],
        (err, result) => {
          if (err) throw err;

          res.status(201).json({ message: "User created successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while creating the user.",
      });
    }
  });

  // Retrieve all users
  router.get("/", async (req, res) => {
    try {
      pool.query(
        "SELECT * FROM users ORDER BY fullnames ASC",
        (err, results) => {
          if (err) throw err;

          res.json(results);
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching users.",
      });
    }
  });

  // Retrieve a single user by user_id
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      pool.query(
        "SELECT * FROM users WHERE user_id = ?",
        [id],
        (err, results) => {
          if (err) throw err;

          if (results.length === 0) {
            res.status(404).json({ message: "User not found." });
          } else {
            res.json(results[0]);
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the user.",
      });
    }
  });

  router.patch("/:id", async (req, res) => {
    const {
      category,
      office,
      department,
      fullnames,
      email,
      password,
      title,
      status,
      date,
      reset_code,
      role,
      Accessrole,
      user_group,
      reset_date,
      is_available,
      phone_number,
    } = req.body;
    const { id } = req.params;

    try {
      pool.query(
        "UPDATE users SET category = ?, office = ?, department = ?, fullnames = ?, email = ?, password = ?, title = ?, status = ?, date = ?, reset_code = ?, role = ?, Accessrole = ?, user_group = ?, reset_date = ?, is_available = ?, phone_number = ? WHERE user_id = ?",
        [
          category,
          office,
          department,
          fullnames,
          email,
          password,
          title,
          status,
          date,
          reset_code,
          role,
          Accessrole,
          user_group,
          reset_date,
          is_available,
          phone_number,
          id,
        ],
        (err, result) => {
          if (err) throw err;

          if (result.affectedRows === 0) {
            res.status(404).json({ message: "User not found." });
          } else {
            res.json({
              message: "User updated successfully.",
            });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while updating the user.",
      });
    }
  });

  // Delete a user
  router.delete("/:id", async (req, res) => {
    const { user_id } = req.params;

    try {
      pool.query(
        "DELETE FROM users WHERE user_id = ?",
        [user_id],
        (err, result) => {
          if (err) throw err;

          if (result.affectedRows === 0) {
            res.status(404).json({ message: "User not found." });
          } else {
            res.json({ message: "User deleted successfully." });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while deleting the user.",
      });
    }
  });

  return router;
};
