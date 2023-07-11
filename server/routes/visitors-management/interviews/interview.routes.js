const express = require("express");
const nodemailer = require("nodemailer");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();
const pdfMakePrinter = require("pdfmake/src/printer");

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
      { text: String(index + 1) || "", style: "tableCell" },
      { text: item.name || "", style: "tableCell" },
      { text: item.email || "", style: "tableCell" },
      { text: item.phone_number || "", style: "tableCell" },
      { text: formatDate(item.interview_date) || "", style: "tableCell" },
      { text: item.interview_time || "", style: "tableCell" },
      { text: item.position || "", style: "tableCell" },
    ];
  });
}

module.exports = (pool) => {
  // Input new interview information
  router.post("/", authenticateJWT, async (req, res) => {
    const interviews = req.body;

    try {
      const insertPromises = interviews.map((interview) => {
        const {
          name,
          email,
          phone_number,
          interview_date,
          interview_time,
          position,
        } = interview;

        return new Promise((resolve, reject) => {
          pool.query(
            "INSERT INTO interviewees (name, email, phone_number, interview_date, interview_time, position) VALUES (?, ?, ?, ?, ?, ?)",
            [
              name,
              email,
              phone_number,
              interview_date,
              interview_time,
              position,
            ],
            async (err, result) => {
              if (err) {
                console.error(err);
                reject(err);
              }

              const subject = "Interview Scheduled - Important Information";
              const text = `Dear ${name},

I hope this message finds you well. We have scheduled an interview with you and find attached below the interview details. We look forward to meeting you.

**Interview Details:**
Date: ${interview_date}
Time: ${interview_time}
Position: ${position}

If you have any questions or need to reschedule, please contact us at 0790300300.

Best regards;
${name}.`;

              sendEmail(email, subject, text)
                .then(() => {
                  resolve();
                })
                .catch((error) => {
                  console.error("Error sending email:", error);
                  reject(error);
                });
            }
          );
        });
      });

      Promise.all(insertPromises)
        .then(() => {
          res.status(201).json({
            message: "Interview information added successfully.",
          });
        })
        .catch((error) => {
          console.error("Error adding interview information:", error);
          res.status(500).json({
            message:
              "An error occurred while adding the interview information.",
          });
        });
    } catch (error) {
      console.error("Error adding interview information:", error);
      res.status(500).json({
        message: "An error occurred while adding the interview information.",
      });
    }
  });

  // Retrieve all interview information
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM interviewees ORDER BY id DESC", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching interview information.",
      });
    }
  });

  // Retrieve a single interview information by id
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      pool.query(
        "SELECT * FROM interviewees WHERE id = ?",
        [id],
        (err, results) => {
          if (err) throw err;

          if (results.length === 0) {
            res
              .status(404)
              .json({ message: "Interview information not found." });
          } else {
            const interview = results[0];

            res.json(interview);
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the interview information.",
      });
    }
  });

 // Update an interview
router.patch("/:id", async (req, res) => {
  const {
    name,
    email,
    phone_number,
    interview_date,
    interview_time,
    position,
  } = req.body;
  const { id } = req.params;

  try {
    pool.query(
      "UPDATE interviewees SET name = ?, email = ?, phone_number = ?, interview_date = ?, interview_time = ?, position = ? WHERE id = ?",
      [
        name,
        email,
        phone_number,
        interview_date,
        interview_time,
        position,
        id,
      ],
      (err, result) => {
        if (err) throw err;

        if (result.affectedRows === 0) {
          res.status(404).json({ message: "Interview not found." });
        } else {
          res.json({
            message: "Interview updated successfully.",
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the interview.",
    });
  }
});

// Delete an interview
router.delete("/:id", async (req, res) => {
const { id } = req.params;

try {
  pool.query(
    "DELETE FROM interviewees WHERE id = ?",
    [id],
    (err, result) => {
      if (err) throw err;

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Interview not found." });
      } else {
        res.json({ message: "Interview deleted successfully." });
      }
    }
  );
} catch (error) {
  res.status(500).json({
    message: "An error occurred while deleting the interview.",
  });
}
});

// Admit a candidate
router.patch("/admit/:id", async (req, res) => {
const { id } = req.params;
const { report_time } = req.body;

try {
  if (report_time) {
    pool.query(
      "UPDATE interviewees SET report_time = ? WHERE id = ?",
      [report_time, id],
      (err, result) => {
        if (err) throw err;

        if (result.affectedRows === 0) {
          res.status(404).json({ message: "Candidate not found." });
        } else {
          res.json({ message: "Candidate admitted successfully." });
        }
      }
    );
  } else {
    res.status(400).json({ message: "Missing report time." });
  }
} catch (error) {
  res.status(500).json({
    message: "An error occurred while admitting the candidate.",
  });
}
});

// Download interview details
router.get("/download-pdf/interview-reports", async (req, res) => {
try {
  // Start date and end date from the client
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  // Define the SQL query to fetch the interview details within the specified date range
  let query = `
  SELECT *
  FROM interviewees
  WHERE interview_date BETWEEN ? AND ?;
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
          text: `Interviews Report from ${startDate} to ${endDate}`,
          fontSize: 20,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
            body: [
              [
                {
                  text: "Index",
                  fillColor: "#BBD4E1",
                  style: "tableHeader",
                },
                {
                  text: "Name",
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
                  text: "Interview Date",
                  fillColor: "#BBD4E1",
                  style: "tableHeader",
                },
                {
                  text: "Interview Time",
                  fillColor: "#BBD4E1",
                  style: "tableHeader",
                },
                {
                  text: "Position",
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

