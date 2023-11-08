const express = require("express");
const ExcelJS = require("exceljs");
const multer = require("multer");
const upload = multer();

const pdfMakePrinter = require("pdfmake/src/printer");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

// Define your fonts
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

// Define your dataToPdfRows function
function dataToPdfRows(data) {
  return data.map((item, index) => {
    return [
      { text: index + 1 ?? "", style: "tableCell" },
      { text: item.pov_name ?? "", style: "tableCell" },
      { text: item.pov_age ?? "", style: "tableCell" },
      { text: item.pov_gender ?? "", style: "tableCell" },
      { text: item.pov_contact ?? "", style: "tableCell" },
      { text: item.pov_amount ?? "", style: "tableCell" },
      { text: item.pov_comment ?? "", style: "tableCell" },
    ];
  });
}

// Multer configuration for file upload
const storage = multer.memoryStorage();

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
        "INSERT INTO `poverty`(`pov_name`, `pov_age`, `pov_gender`, `pov_contact`, `pov_amount`, `pov_comment`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
        [pov_name, pov_age, pov_gender, pov_contact, pov_amount, pov_comment],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message:
                "An error occurred while adding the Poverty Alleviation Project.",
            });
          }
          res.status(201).json({
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
      const query = `SELECT * FROM poverty WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC;`;
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
                      text: "Name",
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
                      text: "Amount",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
                    },
                    {
                      text: "Comment",
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

  // Route to upload excel sheet
  router.post("/upload", upload.single("file"), async (req, res) => {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(req.file.buffer);
      const worksheet = workbook.getWorksheet(1); // Assuming data is in the first worksheet

      const dataFromExcel = [];

      // Iterate through rows and columns to extract data
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          // Skip header row
          const rowData = {
            pov_name: row.getCell(1).value, // Assuming data in column A
            pov_age: row.getCell(2).value, // Assuming data in column F
            pov_gender: row.getCell(3).value, // Assuming data in column E
            pov_contact: row.getCell(3).value, // Assuming data in column E
            pov_amount: row.getCell(3).value, // Assuming data in column E
            pov_comment: row.getCell(3).value, // Assuming data in column E

          };
          dataFromExcel.push(rowData);
        }
      });

      // Insert data into the database
      const insertQuery = `
        INSERT INTO poverty (pov_name, pov_age, pov_gender, pov_contact, pov_amount, pov_comment)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      // Prepare data for insertion
      const values = dataFromExcel.map((row) => [
        row.pov_name,
        row.pov_age,
        row.pov_gender,
        row.pov_contact,
        row.pov_amount,
        row.pov_comment,
      ]);

      // Execute the insert query with multiple values
      pool.getConnection((err, connection) => {
        if (err) {
          console.error("Error establishing database connection:", err);
          res
            .status(500)
            .send("Error processing Excel file and saving to the database");
          return;
        }

        connection.query(insertQuery, values.flat(), (error, results) => {
          connection.release(); // Release the connection back to the pool

          if (error) {
            console.error("Error inserting data into the database:", error);
            res
              .status(500)
              .send("Error processing Excel file and saving to the database");
          } else {
            res
              .status(200)
              .send(
                "Data from Excel sheet processed and saved to the database successfully."
              );
          }
        });
      });
    } catch (error) {
      console.error("Error processing Excel file:", error);
      res.status(500).send("Error processing Excel file.");
    }
  });

  return router;
};
