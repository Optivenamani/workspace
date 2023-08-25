require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const router = express.Router();

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET ;

module.exports = (pool) => {
  router.post(
    "/",
    body("email").notEmpty().withMessage("Email is required"),
    body("code").notEmpty().withMessage("Reset code is required"),
    body("password").notEmpty().withMessage("New password is required"),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, code, password } = req.body;

      try {
        // Verify the reset code using JWT
        jwt.verify(code, JWT_SECRET, (err, decoded) => {
          if (err || decoded.email !== email) {
            return res.status(400).json({ message: "Invalid reset code or email" });
          }

          // Hash the new password using md5
          const hashedPassword = md5(password);

          // Update the user's password and handle database logic
          const updateQuery = "UPDATE defaultdb.users SET password = ?, reset_code = ? WHERE email = ?";
          pool.promise().query(updateQuery, [hashedPassword, null, email])
            .then(() => {
              return res.status(200).json({ message: "Password reset successful" });
            })
            .catch((err) => {
              console.error("Error during password reset:", err);
              return res.status(500).json({ message: "Internal server error", error: err.message });
            });
        });
      } catch (err) {
        console.error("Error during password reset:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
      }
    }
  );
  return router;
};
