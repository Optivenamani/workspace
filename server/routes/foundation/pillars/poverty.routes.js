const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Route for the Add Poverty Alleviation data modal
  router.post("/", authenticateJWT, async (req, res) => {
    const {
      pov_name,
      pov_age,
      pov_gender,
      pov_contact,
      pov_amount,
      pov_comment,
    } = req.body;
    try {
      pool.query(
        "INSERT INTO `poverty`(`pov_name`, `pov_age`, `pov_gender`, `pov_contact`, `pov_amount`, `pov_comment`) VALUES (?, ?, ?, ?, ?, ?)",
        [pov_name, pov_age, pov_gender, pov_contact, pov_amount, pov_comment],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message:
                "An error occurred while adding the Poverty Alleviation Project.",
            });
          }
          res
            .status(201)
            .json({
              message: "Poverty Alleviation Project added successfully!",
            });
        }
      );
    } catch (error) {
      res.status(500).json({
        message:
          "An error occurred while adding the Poverty Alleviation Project.",
      });
    }
  });
  //   Route to get Poverty Alleviation data from database
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM poverty", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message:
          "An error occurred while fetching the Poverty Alleviation Project",
      });
    }
  });

  router.get("/download-template", (req, res) => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add data to the worksheet (for example, headers)
    worksheet.addRow([
      "Name",
      "Age",
      "Gender",
      "Phone",
      "Comment",
      "Amount Disbursed",
    ]);

    // Set response headers to trigger download
    res.setHeader("Content-Disposition", "attachment; filename=template.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Write workbook to response and send it to the client
    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  });

  router.get("/download-pdf", async (req, res) => {
    try {
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
      const query = `SELECT * FROM education WHERE created_at BETWEEN '2023-10-01' AND '2023-11-01' ORDER BY created_at DESC;`;
      pool.query(query, [startDate, endDate], (err, results) => {
        if (err) throw err;
        const docDefinition = {
          pageSize: "A4",
          pageOrientation: "landscape",
          content: [
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
                ],
                body: [
                  [
                    {
                      text: "Index",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
                    },
                    {
                      text: "Student",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
                    },
                    {
                      text: "Age",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
                    },
                    {
                      text: "Gender",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
                    },
                    {
                      text: "Phone",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
                    },
                    {
                      text: "Level of Education",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
                    },
                    {
                      text: "Amount",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
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
              fontSize: 13,
              color: "white",
            },
            tableBody: {
              italic: true,
            },
          },
        };
        // Populate the body array with your data
        docDefinition.content[0].table.body.push(...dataToPdfRows(results));
        // Create the PDF and send it as a response
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        res.setHeader("Content-Type", "application/pdf");
        pdfDoc.pipe(res);
        pdfDoc.end();
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  return router;
};