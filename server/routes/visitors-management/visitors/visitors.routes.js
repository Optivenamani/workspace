const express = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");
const pdfMakePrinter = require("pdfmake/src/printer");
const moment = require("moment");
const schedule = require("node-schedule");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();
require("dotenv").config();

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

const WATI_TOKEN = process.env.WATI_TOKEN;
const WATI_BASE_URL = process.env.WATI_BASE_URL;

// WATI Helper function to send the WhatsApp msg
const sendWhatsAppMessage = async (
  phoneNumber,
  templateName,
  parameters,
  broadcastName
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${WATI_TOKEN}`,
    },
  };
  const bodyData = {
    parameters: parameters,
    template_name: templateName,
    broadcast_name: broadcastName,
  };

  try {
    const response = await axios.post(
      `${WATI_BASE_URL}/api/v1/sendTemplateMessage?whatsappNumber=${phoneNumber}`,
      bodyData,
      config
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send WhatsApp message:", error.message);
    throw error;
  }
};

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
  const autoCheckoutJob = schedule.scheduleJob("00 18 * * *", () => {
    performAutoCheckout(pool);
  });

  async function performAutoCheckout(pool) {
    try {
      // Get the current date and time
      const currentDate = moment().format("YYYY-MM-DD");
      const currentTime = moment().format("HH:mm:ss");

      // Query the database for visitors who have not been checked out
      const query = `
        UPDATE visitors_information
        SET check_out_time = ?
        WHERE check_out_time IS NULL
          AND check_in_date <= ?
      `;

      pool.query(query, [currentTime, currentDate], (error, result) => {
        if (error) {
          console.error("Error during auto-checkout:", error);
          return;
        }

        const affectedRows = result.affectedRows;

        if (affectedRows === 0) {
          console.log("No visitors to auto-checkout.");
        } else {
          console.log(
            "Auto-checkout completed successfully. Checked out",
            affectedRows,
            "visitors."
          );
        }
      });
    } catch (error) {
      console.error("Error during auto-checkout:", error);
    }
  }
  autoCheckoutJob;

  // Helper function to send staff emails
  const sendStaffEmail = (staffEmail, subject, text) => {
    return sendEmail(staffEmail, subject, text)
      .then(() => {
        console.log("Staff email sent successfully.");
      })
      .catch((error) => {
        console.error("Error sending staff email:", error);
      });
  };

// Helper function to send staff WhatsApp messages
const sendStaffWhatsApp = async (staffPhoneNumber, parameters, broadcastName) => {
  const templateName = "visitor_register"; 
  try {
    await sendWhatsAppMessage(staffPhoneNumber, templateName, parameters, broadcastName);
    console.log("WhatsApp message sent successfully to staff.");
    return true; 
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return false; 
  }
};


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
        async (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({
              message:
                "An error occurred while adding the visitor information.",
            });
            return;
          }

          const fetchStaffInfoQuery =
            "SELECT fullnames, email, phone_number FROM defaultdb.users WHERE user_id = ?";
          pool.query(fetchStaffInfoQuery, [staff_id], async (err, staffInfoResults) => {
            if (err) {
              console.error(err);
              res.status(500).json({
                message: "An error occurred while fetching the staff info.",
              });
              return;
            }

            const staffInfo = staffInfoResults[0];

            if (!staffInfo) {
              console.error("Staff information not found.");
              res.status(500).json({
                message: "An error occurred while fetching the staff info.",
              });
              return;
            }

            const staffName = staffInfo.fullnames;
            const staffEmail = staffInfo.email;
            const staffPhoneNumber = staffInfo.phone_number;
           
            console.log("Staff Name:", staffName);
            console.log("Staff Email:", staffEmail);
            console.log("Staff Phone Number:", staffPhoneNumber);


            if (!staffEmail) {
              console.error("Staff email not found.");
              res.status(500).json({
                message: "An error occurred while fetching the staff email.",
              });
              return;
            }

            if (!staffPhoneNumber) {
              console.error("Staff phone number not found.");
              res.status(500).json({
                message: "An error occurred while fetching the staff phone number.",
              });
              return;
            }

            const subject =
            "Urgent: Visitor Arrival - Immediate Attention Required";
          const text = `Dear Sir/Madam,

          I hope this email finds you well. We have a visitor waiting in reception who requires immediate assistance. Please attend to them as soon as possible.

          **Visitor Details:**
          Name: ${name}
          Phone: ${phone}
          Email: ${email}
          Purpose: ${purpose}
          Room: ${visitor_room}

          Please make it a priority to personally greet the visitor and provide any necessary assistance or guidance. Kindly ensure that they are made to feel welcome and comfortable during their stay with us.

          Please provide a warm welcome and ensure their needs are met. If you're unavailable, please inform me so I can arrange for someone else to assist.

          Thank you for your prompt attention.

          Best regards.`;

          const emailSuccess = await sendStaffEmail(staffEmail, subject, text);
           const parameters = [
    { name: "staff_name", value: staffName },
    { name: "visitor_name", value: name },
    { name: "room", value: visitor_room }
  ];
  const broadcastName = "visitor_broadcast"; 

  const whatsappSuccess = await sendStaffWhatsApp(staffPhoneNumber, parameters, broadcastName);

  if (emailSuccess && whatsappSuccess) {
    res.status(201).json({
      message: "Visitor information added successfully.",
    });
  } else {
    res.status(500).json({
      message: "An error occurred while sending messages to the staff.",
    });
  }
});
      }
    );
  } catch (error) {
    console.error("Error adding visitor information:", error);
    res.status(500).json({
      message: "An error occurred while adding the visitor information.",
    });
  }
});

  // Retrieve all visitor information
  router.get("/", authenticateJWT, async (req, res) => {
    try {
      pool.query(
        "SELECT vi.*, u.email as staff_email, u.fullnames as staff_name FROM visitors_information vi INNER JOIN defaultdb.users u ON vi.staff_id = u.user_id ORDER BY id DESC",
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
          if (err) {
            console.error("Error updating visitor:", err);
            res.status(500).json({
              message: "An error occurred while updating the visitor.",
            });
          } else {
            if (result.affectedRows === 0) {
              res.status(404).json({ message: "Visitor not found." });
            } else {
              // Visitor updated successfully, now send the staff email
              const fetchStaffEmailQuery =
                "SELECT email FROM defaultdb.users WHERE user_id = ?";
              pool.query(fetchStaffEmailQuery, [staff_id], (err, results) => {
                if (err) {
                  console.error("Error fetching staff email:", err);
                  res.status(500).json({
                    message: "An error occurred while fetching the staff email.",
                  });
                  return;
                }

                const staffEmail = results[0]?.email;

                if (!staffEmail) {
                  console.error("Staff email not found.");
                  res.status(500).json({
                    message: "An error occurred while fetching the staff email.",
                  });
                  return;
                }

                // Extract the previous data from the database before updating
                pool.query(
                  "SELECT * FROM visitors_information WHERE id = ?",
                  [id],
                  (err, prevResults) => {
                    if (err) {
                      console.error("Error fetching previous data:", err);
                      res.status(500).json({
                        message: "An error occurred while fetching previous data.",
                      });
                      return;
                    }

                    const prevData = prevResults[0];

                    const subject =
                      "Visitor Information Updated - Immediate Attention Required";
                    const text = `Dear Sir/Madam,
  
                    I hope this email finds you well. We want to inform you that visitor information has been updated. Please take a moment to review the changes.
  
                    ** Visitor Details:**
                    Name: ${name}
                    Phone: ${phone}
                    Email: ${email}
                    Purpose: ${purpose}
                    Room: ${visitor_room}
  
                    If you have any concerns or need further information, please do not hesitate to reach out.
  
                    Best regards.`;

                    sendStaffEmail(staffEmail, subject, text)
                      .then(() => {
                        res.json({
                          message: "Visitor updated successfully.",
                        });
                      })
                      .catch((error) => {
                        console.error("Error sending email to staff:", error);
                        res.status(500).json({
                          message:
                            "An error occurred while sending the email to the staff.",
                        });
                      });
                  }
                );
              });
            }
          }
        }
      );
    } catch (error) {
      console.error("Error updating visitor:", error);
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
  router.patch("/checkout/:id", async (req, res) => {
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
              // Send WhatsApp message to the visitor
              const sendThankYouNote = (visitorId) => {
                const getVisitorDetailsQuery = `SELECT name, phone FROM visitors_information WHERE id = ?`;

                pool.query(
                  getVisitorDetailsQuery,
                  [visitorId],
                  async (err, visitorDetails) => {
                    if (err) {
                      console.error("Failed to fetch visitor details:", err);
                      return;
                    }
 
                    if (visitorDetails.length > 0) {
                      const visitorName = visitorDetails[0].name;
                      const visitorPhoneNumber = visitorDetails[0].phone;
                      const templateName = "visitors_checkout";
                      const parameters = [{ name: "name", value: visitorName }];
                      const broadcastName = "test_broadcast";

                      try {
                        await sendWhatsAppMessage(
                          visitorPhoneNumber,
                          templateName,
                          parameters,
                          broadcastName
                        );
                      } catch (error) {
                        console.error("Failed to send thank you note:", error);
                      }
                    }
                  }
                );
              };

              sendThankYouNote(id);
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
