require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const router = express.Router();

// Store reset codes and their creation times in memory
const resetCodes = {};

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
        // Check if the reset code and email combination exists in memory
        if (!(email in resetCodes) || resetCodes[email].code !== code) {
          return res.status(400).json({ message: "Invalid reset code or email" });
        }

        // Check if the reset code was generated within the last 10 minutes
        const currentTime = new Date().getTime();
        const tenMinutesInMillis = 10 * 60 * 1000; // 10 minutes in milliseconds

        if (currentTime - resetCodes[email].timestamp > tenMinutesInMillis) {
          return res.status(400).json({ message: "Reset code has expired" });
        }

        // Update the user's password and clear the reset code
        const hashedPassword = crypto.createHash("md5").update(password).digest("hex");
        await pool
          .promise()
          .query("UPDATE defaultdb.users SET password = ?, reset_code = NULL WHERE reset_code = ? AND email = ?", [
            hashedPassword,
            code,
            email,
          ]);

        // Clear the reset code from memory
        delete resetCodes[email];

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
