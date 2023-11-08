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

// multer config for image upload
const imageUpload = multer({ dest: "uploads/" });

module.exports = (pool, io) => {
  // Route for adding education details
  router.post("/", imageUpload.single("educ_image"), async (req, res) => {
    const {
      educ_name,
      educ_age,
      educ_gender,
      educ_phone,
      educ_level,
      educ_amount,
    } = req.body;

    const educ_image = req.file.path.replace(/^uploads[\\\/]/, ""); // Remove 'uploads/' from the beginning of the path

    try {
      pool.query(
        "INSERT INTO `education`(`educ_name`, `educ_age`, `educ_gender`, `educ_phone`, `educ_level`, `educ_amount`, `educ_image`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
        [
          educ_name,
          educ_age,
          educ_gender,
          educ_phone,
          educ_level,
          educ_amount,
          educ_image,
        ],
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
  
  // Route to get Education Data
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM education", (err, results) => {
        if (err) throw err;

        const educationDataWithImageUrls = results.map((education) => {
          return {
            educ_id: education.educ_id,
            educ_name: education.educ_name,
            educ_age: education.educ_age,
            educ_gender: education.educ_gender,
            educ_phone: education.educ_phone,
            educ_level: education.educ_level,
            educ_amount: education.educ_amount,
            educ_image: `http://localhost:8080/uploads/${education.educ_image}`, // Replace with your actual server address
          };
        });

        res.json(educationDataWithImageUrls);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching Student information.",
      });
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
            educ_name: row.getCell(1).value, // Assuming data in column A
            educ_age: row.getCell(2).value, // Assuming data in column B
            educ_gender: row.getCell(3).value, // Assuming data in column C
            educ_phone: row.getCell(4).value, // Assuming data in column D
            educ_level: row.getCell(5).value, // Assuming data in column E
            educ_amount: row.getCell(6).value, // Assuming data in column F
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
        row.educ_name,
        row.educ_age,
        row.educ_gender,
        row.educ_phone,
        row.educ_level,
        row.educ_amount,
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

  // Route to download Excel sheet
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

  // Download the Student data info in a pdf
  router.get("/download-pdf", async (req, res) => {
    try {
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
      const query = `SELECT * FROM education WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC;`;
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

  //   Route to get Event Data
  router.patch("/", async (req, res) => {
    const { educ_amount } = req.body;
    try {
      pool.query(
        "UPDATE allocated_amounts SET education = educ_amount WHERE amount_id = 1;",
        (err, results) => {
          if (err) throw err;

          res.json(results);
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching Student information.",
      });
    }
  });

  //Route to turn data to EXCEL SHEET
  // router.get("/download-excel", async (req, res) => {
  //   try {
  //     // Fetch data from the database
  //     const dataFromDB = await fetchDataFromDB(); // Modify this based on your database retrieval logic

  //     // Create a new Excel workbook and worksheet
  //     const workbook = new ExcelJS.Workbook();
  //     const worksheet = workbook.addWorksheet("Data"); // You can change the sheet name if desired

  //     // Add headers to the worksheet
  //     worksheet.addRow([
  //       "Name of The student",
  //       "Age of The student",
  //       "Gender of The student",
  //       "Phone Contact",
  //       "Level of Education",
  //       "Amount Disbursed",
  //     ]); // Modify these headers based on your data structure

  //     // Iterate through dataFromDB and add rows to the worksheet
  //     dataFromDB.forEach((row) => {
  //       const rowData = [row.educ_name, row.educ_age, row.educ_gender, row.educ_phone, row.educ_level, row.educ_amount]; // Modify this based on your data structure
  //       worksheet.addRow(rowData);
  //     });

  //     // Save the workbook to a buffer and send it as a response
  //     workbook.xlsx
  //       .writeBuffer()
  //       .then((buffer) => {
  //         res.setHeader(
  //           "Content-Type",
  //           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  //         );
  //         res.setHeader(
  //           "Content-Disposition",
  //           "attachment; filename=data.xlsx"
  //         );
  //         res.send(buffer);
  //       })
  //       .catch((error) => {
  //         console.error("Error creating Excel sheet:", error);
  //         res.status(500).send("Error creating Excel sheet");
  //       });
  //   } catch (error) {
  //     console.error("Error fetching data from the database:", error);
  //     res.status(500).send("Error fetching data from the database");
  //   }
  // });

  return router;
};
