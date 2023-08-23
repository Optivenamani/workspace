require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();

module.exports = (pool) => {
  router.post(
    "/",
    // Validate reset code and new password
    body("code").notEmpty().withMessage("Reset code is required"),
    body("password").notEmpty().withMessage("New password is required"),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { code, password } = req.body;
      const { email } = req.query; // Get the email from the URL query parameters

      try {
        // Check if the reset code and email combination exists in the database
        const [userRows] = await pool
          .promise()
          .query("SELECT * FROM users WHERE reset_code = ? AND email = ?", [code, email]);

        if (userRows.length === 0) {
          return res.status(400).json({ message: "Invalid reset code or email" });
        }

        // Update the user's password and clear the reset code
        const hashedPassword = crypto.createHash("md5").update(password).digest("hex");
        await pool
          .promise()
          .query("UPDATE users SET password = ?, reset_code = NULL WHERE reset_code = ? AND email = ?", [
            hashedPassword,
            code,
            email,
          ]);

        res.status(200).json({ message: "Password reset successful" });
      } catch (err) {
        console.error("Error during password reset:", err);
        res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }
    }
  );
  return router;
};
