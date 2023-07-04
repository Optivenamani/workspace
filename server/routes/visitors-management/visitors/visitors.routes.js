const express = require("express");
const nodemailer = require("nodemailer");
const pdfMakePrinter = require("pdfmake/src/printer");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

// Nodemailer helper function to send email
async function sendEmail(userEmail, subject, text) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: `notify@optiven.co.ke`, // your domain email account
      pass: `Peace@6t4r#!`, // your domain email password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Optiven Visitors Management Platform 💂" <notify@optiven.co.ke>', // sender address
    to: userEmail, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
  });
}

// Define fonts
var fonts = {
  Roboto: {
    normal: "node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf",
    bold: "node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf",
    italic: "node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf",
    bolditalics:
      "node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf",
  },
};

// Create a new printer with the fonts
var printer = new pdfMakePrinter(fonts);

// function to format date to db friendly format
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Map data to fields that go to the pdf
function dataToPdfRows(data) {
  return data.map((item, index) => {
    return [
      { text: index + 1 ?? "", style: "tableCell" },
      { text: item.name ?? "", style: "tableCell" },
      { text: item.email ?? "", style: "tableCell" },
      { text: item.phone ?? "", style: "tableCell" },
      { text: item.purpose ?? "", style: "tableCell" },
      { text: item.vehicle_registration ?? "", style: "tableCell" },
      { text: item.department ?? "", style: "tableCell" },
      { text: item.check_in_time ?? "", style: "tableCell" },
      { text: formatDate(item.check_in_date) ?? "", style: "tableCell" },
      { text: item.staff_name ?? "", style: "tableCell" },
      { text: item.visitor_room ?? "", style: "tableCell" },
    ];
  });
}

module.exports = (pool) => {
  // Input new visitor information
  router.post("/", authenticateJWT, async (req, res) => {
    const {
      name,
      phone,
      email,
      vehicle_registration,
      purpose,
      department,
      check_in_time,
      check_in_date,
      staff_id,
      visitor_room,
    } = req.body;

    try {
      pool.query(
        "INSERT INTO visitors_information (name, phone, email, vehicle_registration, purpose, department, check_in_time, check_in_date, staff_id, visitor_room) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          name,
          phone,
          email,
          vehicle_registration,
          purpose,
          department,
          check_in_time,
          check_in_date,
          staff_id,
          visitor_room,
        ],
        (err, result) => {
          if (err) throw err;

          res
            .status(201)
            .json({ message: "Visitor information added successfully." });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the visitor information.",
      });
    }
  });

  // Retrieve all visitor information
  router.get("/", authenticateJWT, async (req, res) => {
    try {
      pool.query(
        "SELECT vi.*, u.email as staff_email, u.fullnames as staff_name FROM visitors_information vi INNER JOIN defaultdb.users u ON vi.staff_id = u.user_id",
        (err, results) => {
          if (err) throw err;

          res.json(results);
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching visitor information.",
      });
    }
  });

  // Retrieve a single visitor information by id
  router.get("/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;

    try {
      pool.query(
        `SELECT 
        id AS visitor_id,
        visitors_information.*,
        users.fullnames as staff_name
      FROM visitors_information
      INNER JOIN defaultdb.users ON visitors_information.staff_id = users.user_id 
      WHERE id = ?`,
        [id],
        (err, results) => {
          if (err) throw err;

          if (results.length === 0) {
            res.status(404).json({ message: "Visitor information not found." });
          } else {
            const visitor = results[0];

            res.json(visitor);
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the visitor information.",
      });
    }
  });

  // Update a visitor
  router.patch("/:id", authenticateJWT, async (req, res) => {
    const {
      name,
      phone,
      email,
      vehicle_registration,
      purpose,
      department,
      check_in_time,
      check_in_date,
      staff_id,
      visitor_room,
    } = req.body;
    const { id } = req.params;

    try {
      pool.query(
        "UPDATE visitors_information SET name = ?, phone = ?, email = ?, vehicle_registration = ?, purpose = ?, department = ?, check_in_time = ?, check_in_date = ?, staff_id = ?, visitor_room = ? WHERE id = ?",
        [
          name,
          phone,
          email,
          vehicle_registration,
          purpose,
          department,
          check_in_time,
          check_in_date,
          staff_id,
          visitor_room,
          id,
        ],
        (err, result) => {
          if (err) throw err;

          if (result.affectedRows === 0) {
            res.status(404).json({ message: "Visitor not found." });
          } else {
            res.json({
              message: "Visitor updated successfully.",
            });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while updating the visitor.",
      });
    }
  });

  // Delete a visitor
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      pool.query(
        "DELETE FROM visitors_information WHERE id = ?",
        [id],
        (err, result) => {
          if (err) throw err;

          if (result.affectedRows === 0) {
            res.status(404).json({ message: "Visitor not found." });
          } else {
            res.json({ message: "Visitor deleted successfully." });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while deleting the visitor.",
      });
    }
  });

  // Checkout a visitor
  router.patch("/checkout/:id", authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { check_out_time } = req.body;

    try {
      if (check_out_time) {
        pool.query(
          "UPDATE visitors_information SET check_out_time = ? WHERE id = ?",
          [check_out_time, id],
          (err, result) => {
            if (err) throw err;

            if (result.affectedRows === 0) {
              res.status(404).json({ message: "Visitor not found." });
            } else {
              res.json({ message: "Visitor updated successfully." });
            }
          }
        );
      } else {
        res.status(400).json({ message: "Missing check-out time." });
      }
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while updating the visitor.",
      });
    }
  });

  // Download visitors' info
  router.get("/download-pdf/visitors-info", async (req, res) => {
    try {
      // start date and end date from the client
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;

      // Define the SQL query to fetch the visitors' information within the specified date range
      let query = `
      SELECT 
        vi.*, 
        u.fullnames as staff_name
      FROM visitors_information vi
      INNER JOIN defaultdb.users u ON vi.staff_id = u.user_id
      WHERE check_in_date BETWEEN ? AND ?;
      `;

      // Execute the SQL query
      pool.query(query, [startDate, endDate], (err, results) => {
        if (err) throw err;

        // Define the document definition for the PDF
        const docDefinition = {
          pageSize: "A4",
          pageOrientation: "landscape",
          content: [
            {
              text: `Visitors Reports from ${startDate} to ${endDate}`,
              fontSize: 20,
              alignment: "center",
              margin: [0, 0, 0, 20],
            },
            {
              table: {
                headerRows: 1,
                widths: [
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                  "auto",
                ],
                body: [
                  [
                    {
                      text: "Index",
                      fillColor: "#BBD4E1",
                      style: "tableHeader",
                    },
                    {
                      text: "Visitor Name",
                      fillColor: "#BBD4E1",
                      style: "tableHeader",
                    },
                    {
                      text: "Email",
                      fillColor: "#BBD4E1",
                      style: "tableHeader",
                    },
                    {
                      text: "Phone Number",
                      fillColor: "#BBD4E1",
                      style: "tableHeader",
                    },
                    {
                      text: "Purpose",
                      fillColor: "#BBD4E1",
                      style: "tableHeader",
                    },
                    {
                      text: "Vehicle Reg.",
                      fillColor: "#BBD4E1",
                      style: "tableHeader",
                    },
                    {
                      text: "Department",
                      fillColor: "#BBD4E1",
                      style: "tableHeader",
                    },
                    {
                      text: "Check-in Time",
                      fillColor: "#BBD4E1",
                      style: "tableHeader",
                    },
                    {
                      text: "Check-in Date",
                      fillColor: "#BBD4E1",
                      style: "tableHeader",
                    },
                    {
                      text: "Staff Name",
                      fillColor: "#BBD4E1",
                      style: "tableHeader",
                    },
                    {
                      text: "Visitor Room",
                      fillColor: "#BBD4E1",
                      style: "tableHeader",
                    },
                  ],
                ],
              },
              layout: {
                hLineWidth: function (i, node) {
                  return 0;
                },
                vLineWidth: function (i, node) {
                  return 0;
                },
                fillColor: function (rowIndex, node, columnIndex) {
                  return rowIndex % 2 === 0 ? "#D3D3D3" : null;
                },
              },
            },
          ],
          styles: {
            tableHeader: {
              bold: true,
              fontSize: 13,
              color: "white",
            },
            tableCell: {
              fontSize: 12,
              margin: [0, 5],
            },
          },
        };

        // Populate the body array of the table with the fetched data
        docDefinition.content[1].table.body.push(...dataToPdfRows(results));
        // Create the PDF document using pdfmake
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        // Set the response headers to indicate a PDF file
        res.setHeader("Content-Type", "application/pdf");
        // Stream the PDF document as the response
        pdfDoc.pipe(res);
        pdfDoc.end();
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while generating the PDF.");
    }
  });

  return router;
};
