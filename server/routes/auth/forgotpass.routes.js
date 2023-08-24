require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();

// Nodemailer helper function to send email
async function sendEmail(userEmail, subject, text) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: `notify@optiven.co.ke`,
      pass: `Peace@6t4r#!`,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Optiven Workspace Platform 💂" <notify@optiven.co.ke>',
    to: userEmail,
    subject: subject,
    text: text,
  });
}

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
          .query("SELECT * FROM defaultdb.users WHERE email = ?", [email]);

        if (userRows.length === 0) {
          return res.status(400).json({ message: "Email not found" });
        }

        // Generate a new reset code
        const resetCode = crypto.randomBytes(20).toString("hex");

        // Store the reset code in the database, overwriting any existing reset codes
        await pool
          .promise()
          .query(
            "UPDATE defaultdb.users SET reset_code = ? WHERE email = ?",
            [resetCode, email]
          );

        // Send reset email with the reset code
        const resetLink = `http://localhost:3000/reset-password?code=${resetCode}`;
        const resetEmailSubject = "Password Reset";
        const resetEmailText = `Click the following link to reset your password: ${resetLink}`;

        await sendEmail(email, resetEmailSubject, resetEmailText);

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
