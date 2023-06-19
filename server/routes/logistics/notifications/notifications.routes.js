const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();
const util = require("util");

module.exports = (pool) => {
  // Convert pool.query to use promises
  pool.query = util.promisify(pool.query);

  // Fetch all notifications
  router.get("/", authenticateJWT, async (req, res) => {
    try {
      const userId = req.user.id;
      const query =
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY timestamp DESC";
      const result = await pool.query(query, [userId]);

      // Convert the date object to a serializable format (ISO string)
      const serializedResult = result.map((notification) => ({
        ...notification,
        timestamp: notification.timestamp.toISOString(),
      }));

      res.status(200).json({ notifications: serializedResult });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Fetch a single notification by ID
  router.get("/:id", authenticateJWT, async (req, res) => {
    try {
      const notificationId = req.params.id;

      if (!notificationId) {
        return res
          .status(400)
          .json({ message: "Notification ID is missing or invalid" });
      }

      const query = "SELECT * FROM notifications WHERE id = ?";
      const result = await pool.query(query, [notificationId]);

      if (result.length > 0) {
        // Convert the date object to a serializable format (ISO string)
        const serializedResult = {
          ...result[0],
          timestamp: result[0].timestamp.toISOString(),
        };

        res.status(200).json({ notification: serializedResult });
      } else {
        res.status(404).json({ message: "Notification not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update a notification's read status
  router.patch("/:id", authenticateJWT, async (req, res) => {
    try {
      const notificationId = req.params.id;
      const { isRead } = req.body;

      if (!notificationId) {
        return res
          .status(400)
          .json({ message: "Notification ID is missing or invalid" });
      }

      if (typeof isRead !== "boolean") {
        return res
          .status(400)
          .json({ message: "isRead should be a boolean value" });
      }

      const query = "UPDATE notifications SET isRead = 1 WHERE id = ?";
      const result = await pool.query(query, [notificationId]);

      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Notification read status updated" });
      } else {
        res.status(404).json({ message: "Notification not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};
