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
      { text: item.event_name ?? "", style: "tableCell" },
      { text: item.event_location ?? "", style: "tableCell" },
      { text: item.event_amount ?? "", style: "tableCell" },
      { text: item.pillar ?? "", style: "tableCell" },
     ];
  });
}

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (pool, io) => {
  // Route for the Add event modal
  router.post("/", async (req, res) => {
    const {
      event_name,
      authenticateJWT,
      event_location,
      event_amount,
      pillar,
    } = req.body;
    try {
      pool.query(
        "INSERT INTO Events (event_name, event_location, event_amount, pillar, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)",
        [event_name, event_location, event_amount, pillar],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message: "An error occurred while creating the event.",
            });
          }
          res.status(201).json({ message: "Event created successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while creating the event.",
      });
    }
  });

  router.get("/pillar-count", (req, res) => {
    const { pillar } = req.query;
    pool.query(
      `SELECT * FROM Events WHERE pillar = ?`,
      [pillar],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Server Error" });
        } else {
          res.json(results);
        }
      }
    );
  });

  //Route to get Event Data
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM Events", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching Event information.",
      });
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
      "Location",
      "Amount Disbursed",
      "Pillar",
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
    const query = `SELECT * FROM Events WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC;`;
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
                    text: "Name of the event",
                    fillColor: "#202A44",
                    style: "tableHeader",
                    bold: true,
                  },
                  {
                    text: "Location",
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
                    text: "Pillar Supported",
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
