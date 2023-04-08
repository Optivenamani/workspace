require("dotenv").config();
const express = require("express");
const { body, validationResult } = require("express-validator");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const router = express.Router();

module.exports = (connection) => {
  router.post(
    "/",
    // Validate email and password
    body("email").isEmail().withMessage("Invalid email address"),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const hashedPassword = md5(password);

      try {
        const [rows] = await connection
          .promise()
          .query("SELECT * FROM users WHERE email = ? AND password = ?", [
            email,
            hashedPassword,
          ]);

        if (rows.length > 0) {
          // User found, authentication successful
          const user = rows[0];
          delete user.password;

          // Sign and set the token
          const token = jwt.sign(
            { id: user.user_id, Accessrole: user.Accessrole },
            process.env.JWT_SECRET,
            {
              expiresIn: "1d",
            }
          );

          res.status(200).json({ user, token });
        } else {
          // User not found, authentication failed
          res.status(401).json({ message: "Invalid email or password" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );
  return router;
};
