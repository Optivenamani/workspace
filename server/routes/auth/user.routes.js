const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

module.exports = (connection) => {
  router.get("/", async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({ message: "Token error" });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme) || !token) {
      return res.status(401).json({ message: "Malformatted token" });
    }

    try {
      const decoded = jwt.verify(token, "secret");
      const [rows] = await connection
        .promise()
        .query("SELECT * FROM users WHERE user_id = ?", [decoded.id]);

      if (rows.length > 0) {
        const user = rows[0];
        delete user.password;
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};
