const express = require("express");
const ExcelJS = require("exceljs");
const multer = require("multer");
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
      { text: item.educ_name ?? "", style: "tableCell" },
      { text: item.educ_age ?? "", style: "tableCell" },
      { text: item.educ_gender ?? "", style: "tableCell" },
      { text: item.educ_phone ?? "", style: "tableCell" },
      { text: item.educ_level ?? "", style: "tableCell" },
      { text: item.educ_amount ?? "", style: "tableCell" },
    ];
  });
}

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (pool, io) => {
  // Route for the Add event modal
  router.post("/", authenticateJWT, async (req, res) => {
    const {
      educ_name,
      educ_age,
      educ_gender,
      educ_phone,
      educ_level,
      educ_amount,
    } = req.body;
    try {
      pool.query(
        "INSERT INTO `education`(`educ_name`, `educ_age`, `educ_gender`, `educ_phone`, `educ_level`, `educ_amount`, `created_at`)  VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
        [educ_name, educ_age, educ_gender, educ_phone, educ_level, educ_amount],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message: "An error occurred while adding the Student.",
            });
          }
          res.status(201).json({ message: "Student added successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the Student.",
      });
    }
  });

  //   Route to get Event Data
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM education", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching Student information.",
      });
    }
  });

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
            column1: row.getCell(1).value, // Assuming data in column A
            column2: row.getCell(2).value, // Assuming data in column B
            column3: row.getCell(3).value, // Assuming data in column C
            column4: row.getCell(4).value, // Assuming data in column D
            column5: row.getCell(5).value, // Assuming data in column E
            column6: row.getCell(6).value, // Assuming data in column F
            // Add more columns as needed
          };
          dataFromExcel.push(rowData);
        }
      });

      // Insert data into the database
      const insertQuery = `
        INSERT INTO education (educ_name, educ_age, educ_gender, educ_phone, educ_level, educ_amount)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      // Prepare data for insertion
      const values = dataFromExcel.map((row) => [
        row.column1,
        row.column2,
        row.column3,
        row.column4,
        row.column5,
        row.column6,
      ]);

      // Execute the insert query with multiple values
      await pool.query(insertQuery, values);

      res.status(200).send("Data saved to the database");
    } catch (error) {
      console.error(
        "Error processing Excel file and saving to the database:",
        error
      );
      res
        .status(500)
        .send("Error processing Excel file and saving to the database");
    }
  });

  router.get("/download-template", (req, res) => {
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Add data to the worksheet (for example, headers)
    worksheet.addRow([
      "Name of The student",
      "Age of The student",
      "Gender of The student",
      "Phone Contact",
      "Level of Education",
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

  // Download the approved site visits info in a pdf
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
