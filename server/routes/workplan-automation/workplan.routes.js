const express = require("express");
const authenticateJWT = require("../../middleware/authenticateJWT");
const checkPermissions = require("../../middleware/checkPermissions");
const router = express.Router();
const nodemailer = require("nodemailer");



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
    from: '"Optiven Workplan 💂" <notify@optiven.co.ke>', 
    to: userEmail, 
    subject: subject, 
    text: text, 
  });
}


module.exports = (pool) => {
  // GET all workplans for the authenticated user
  router.get("/", authenticateJWT, (req, res) => {
    const { user_id } = req.query;
    const query =
      "SELECT * FROM workplans WHERE marketer_id = ? ORDER BY end_date DESC";
    pool.query(query, [user_id], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else {
        res.json(results);
      }
    });
  });

  // GET a specific workplan
  router.get("/:id",  (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM workplans WHERE id = ?";
    pool.query(query, [id], (err, workplan) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else if (workplan.length > 0) {
        res.json(workplan[0]);
      } else {
        res.status(404).json({ message: "Workplan not found" });
      }
    });
  });

  // CREATE a new workplan for the authenticated user
  router.post("/", authenticateJWT, (req, res) => {
    const { start_date, end_date, marketer_id, status } = req.body;

    // Check if any workplan with overlapping date range exists for the same marketer_id
    const checkQuery =
      "SELECT * FROM workplans WHERE marketer_id = ? AND start_date <= ? AND end_date >= ?";
    pool.query(
      checkQuery,
      [marketer_id, end_date, start_date],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Server Error" });
        } else if (results.length > 0) {
          // If a workplan with overlapping date range exists, return an error response
          res.status(409).json({
            message:
              "A workplan with overlapping date range already exists for this marketer.",
            status: 409,
          });
        } else {
          // If no workplan with overlapping date range exists, insert the new workplan
          const insertQuery =
            "INSERT INTO workplans (start_date, end_date, marketer_id, status) VALUES (?, ?, ?, ?)";
          pool.query(
            insertQuery,
            [start_date, end_date, marketer_id, status],
            (err) => {
              if (err) {
                console.error(err);
                res.status(500).json({ message: "Server Error" });
              } else {
                res.json({ message: "Workplan created successfully" });
              }
            }
          );
        }
      }
    );
  });

  // UPDATE an existing workplan for the authenticated user
  router.put("/:id", authenticateJWT, (req, res) => {
    const { user_id } = req.user;
    const { id } = req.params;
    const { start_date, end_date } = req.body;
    const query =
      "UPDATE workplans SET start_date = ?, end_date = ? WHERE id = ? AND marketer_id = ?";
    pool.query(query, [start_date, end_date, id, user_id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else if (result.affectedRows > 0) {
        res.json({ message: "Workplan updated successfully" });
      } else {
        res.status(404).json({ message: "Workplan not found" });
      }
    });
  });

// Route to approve a workplan (only accessible by authorized Level 1 Managers)
router.put("/:id/approve", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE workplans SET status = 'approved' WHERE id = ?";
  
  // Fetch the marketerid from the workplans table
  const getMarketerIdQuery = "SELECT marketer_id FROM workplans WHERE id = ?";
  pool.query(getMarketerIdQuery, [id], async (err, marketerResult) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
      return;
    }

    if (marketerResult.length === 0) {
      res.status(404).json({ message: "Workplan not found" });
      return;
    }

    const marketerId = marketerResult[0].marketer_id;
    

    // Now, use the marketerId as user_id to fetch the user's email and full name from the defaultdb.users table
    const getEmailAndFullNameQuery = "SELECT email, fullnames FROM defaultdb.users WHERE user_id = ?";
    pool.query(getEmailAndFullNameQuery, [marketerId], async (userErr, userResult) => {
      if (userErr) {
        console.error(userErr);
        res.status(500).json({ message: "Server Error" });
        return;
      }

      if (userResult.length === 0) {
        console.log("User not found");
        res.status(404).json({ message: "Recipient not found" });
        return;
      }

      const userEmail = userResult[0].email;
      const userFullName = userResult[0].fullnames;

      

      // Now, update the workplan status
      pool.query(query, [id], async (updateErr, updateResult) => {
        if (updateErr) {
          console.error(updateErr);
          res.status(500).json({ message: "Server Error" });
        } else if (updateResult.affectedRows > 0) {
          // Send approval email notification with recipient's full name
          const subject = "Workplan Approved";
          const text = `
            Dear ${userFullName},

            Your workplan has been approved successfully. Here are the details:

            - Workplan ID: ${id}
            - Status: Approved

            Thank you for your hard work!

            Sincerely,
            Optiven Team
          `;
          await sendEmail(userEmail, subject, text);

          res.json({ message: "Workplan approved successfully" });
        } else {
          res.status(404).json({ message: "Workplan not found" });
        }
      });
    });
  });
});



// Route to reject a workplan (only accessible by authorized Level 1 Managers)
router.put("/:id/reject", (req, res) => {
  const { id } = req.params;
  const query = "UPDATE workplans SET status = 'rejected' WHERE id = ?";

  // Fetch the marketer_id from the workplans table
  const getMarketerIdQuery = "SELECT marketer_id FROM workplans WHERE id = ?";
  pool.query(getMarketerIdQuery, [id], async (err, marketerResult) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
      return;
    }

    if (marketerResult.length === 0) {
      res.status(404).json({ message: "Workplan not found" });
      return;
    }

    const marketerId = marketerResult[0].marketer_id;

    // Now, use the marketerId as user_id to fetch the user's email and full name from the defaultdb.users table
    const getEmailAndFullNameQuery = "SELECT email, fullnames FROM defaultdb.users WHERE user_id = ?";
    pool.query(getEmailAndFullNameQuery, [marketerId], async (userErr, userResult) => {
      if (userErr) {
        console.error(userErr);
        res.status(500).json({ message: "Server Error" });
        return;
      }

      if (userResult.length === 0) {
        console.log("User not found");
        res.status(404).json({ message: "Recipient not found" });
        return;
      }

      const userEmail = userResult[0].email;
      const userFullName = userResult[0].fullnames;

      // Now, update the workplan status
      pool.query(query, [id], async (updateErr, updateResult) => {
        if (updateErr) {
          console.error(updateErr);
          res.status(500).json({ message: "Server Error" });
        } else if (updateResult.affectedRows > 0) {
          // Send rejection email notification with recipient's full name
          const subject = "Workplan Rejected";
          const text = `
            Dear ${userFullName},

            Unfortunately, your workplan has been rejected. Here are the details:

            - Workplan ID: ${id}
            - Status: Rejected

            If you have any questions or need further assistance, please don't hesitate to reach out to us.

            Sincerely,
            Optiven Team
          `;
          await sendEmail(userEmail, subject, text);

          res.json({ message: "Workplan rejected successfully" });
        } else {
          res.status(404).json({ message: "Workplan not found" });
        }
      });
    });
  });
});




  // DELETE a workplan for the authenticated user
  router.delete("/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;

    const deleteActivitiesQuery =
      "DELETE FROM workplan_activities WHERE workplan_id = ?";
    pool.query(deleteActivitiesQuery, [id], (err, activityResult) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      } else {
        //  delete the workplan
        const deleteWorkplanQuery = "DELETE FROM workplans WHERE id = ?";
        pool.query(deleteWorkplanQuery, [id], (err, workplanResult) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: "Server Error" });
          } else if (workplanResult.affectedRows > 0) {
            res.json({
              message:
                "Workplan and associated activities deleted successfully",
            });
          } else {
            res.status(404).json({ message: "Workplan not found" });
          }
        });
      }
    });
  });

  return router;
};
