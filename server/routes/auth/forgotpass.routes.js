require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();

module.exports = (pool) => {
    router.post(
        "/",
        // Validate email
        body("email")
          .isEmail().withMessage("Invalid email address")
          .custom((value) => value.endsWith("@optiven.co.ke")).withMessage("Email domain must be @optiven.co.ke"),
        async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      try {
        // Check if the email exists in the database
        const [userRows] = await pool
          .promise()
          .query("SELECT * FROM users WHERE email = ?", [email]);

        if (userRows.length === 0) {
          return res.status(400).json({ message: "Email not found" });
        }

        // Generate a reset code (using crypto or other secure method)
        const resetCode = crypto.randomBytes(20).toString("hex");

        // Store or update the reset code in the database (e.g., user table)
        await pool
          .promise()
          .query("UPDATE users SET reset_code = ? WHERE email = ?", [
            resetCode,
            email,
          ]);

        // Send reset email with the reset code
        const transporter = nodemailer.createTransport({
          // Set up your email sending configuration here
        });

        const mailOptions = {
            from: "notify@optiven.co.ke",
            to: email,
            subject: "Password Reset",
            text: `Click the following link to reset your password: http://localhost:3000/reset-password?code=${resetCode}&email=${email}`,
          };
          
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset email sent" });
      } catch (err) {
        console.error("Error during forgot password:", err);
        res
          .status(500)
          .json({ message: "Internal server error", error: err.message });
      }
    }
  );
  return router;
};
