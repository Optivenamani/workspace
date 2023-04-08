const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const AccessRoles = require("../../constants/accessRoles");
const router = express.Router();

// Middleware for checking user permissions
const checkPermissions = (allowedRoles) => {
  return (req, res, next) => {
    const userAccessRole = req.user.Accessrole;

    if (allowedRoles.some((role) => userAccessRole.includes(role))) {
      next();
    } else {
      res.status(403).json({
        message: "Forbidden: You don't have permission to perform this action.",
      });
    }
  };
};

module.exports = (connection) => {
  // Create a new site visit request
  router.post("/", authenticateJWT, async (req, res) => {
    const { site_name, pickup_location, pickup_time, pickup_date, clients } =
      req.body;
    const created_by = req.user.id; // Get the authenticated user ID from the JWT payload

    try {
      // Insert the site visit request into the `site_visits` table
      connection.query(
        "INSERT INTO site_visits (site_name, pickup_location, pickup_time, pickup_date, status, created_by) VALUES (?, ?, ?, ?, 'PENDING', ?)",
        [site_name, pickup_location, pickup_time, pickup_date, created_by],
        (err, result) => {
          if (err) throw err;

          // Insert clients associated with this site visit request into the `clients` table
          const site_visit_id = result.insertId;
          const clientValues = clients.map((client) => [
            site_visit_id,
            client.name,
            client.email,
            client.phone_number,
          ]);
          connection.query(
            "INSERT INTO clients (site_visit_id, name, email, phone_number) VALUES ?",
            [clientValues],
            (err) => {
              if (err) throw err;
              res
                .status(201)
                .json({ message: "Site visit request created successfully!" });
            }
          );
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while creating the site visit request.",
      });
    }
  });

  router.get("/", authenticateJWT, async (req, res) => {
    try {
      connection.query("SELECT * FROM site_visits", (err, results) => {
        if (err) throw err;
        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching site visit requests.",
      });
    }
  });

  // Update site visit request status
  router.patch(
    "/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
      AccessRoles.isMarketer,
    ]),
    async (req, res) => {
      const { status } = req.body;
      const { id } = req.params;

      try {
        connection.query(
          "UPDATE site_visits SET status = ? WHERE id = ?",
          [status, id],
          (err, result) => {
            if (err) throw err;
            if (result.affectedRows === 0) {
              res
                .status(404)
                .json({ message: "Site visit request not found." });
            } else {
              res.json({
                message: "Site visit request status updated successfully.",
              });
            }
          }
        );
      } catch (error) {
        res.status(500).json({
          message:
            "An error occurred while updating the site visit request status.",
        });
      }
    }
  );

  // Delete a site visit request
  router.delete(
    "/:id",
    authenticateJWT,
    checkPermissions([
      AccessRoles.isAdmin1,
      AccessRoles.isAdmin2,
      AccessRoles.isAdmin3,
    ]),
    async (req, res) => {
      const { id } = req.params;

      try {
        connection.query(
          "DELETE FROM site_visits WHERE id = ?",
          [id],
          (err, result) => {
            if (err) throw err;
            if (result.affectedRows === 0) {
              res
                .status(404)
                .json({ message: "Site visit request not found." });
            } else {
              res.json({ message: "Site visit request deleted successfully." });
            }
          }
        );
      } catch (error) {
        res.status(500).json({
          message: "An error occurred while deleting the site visit request.",
        });
      }
    }
  );

  return router;
};
