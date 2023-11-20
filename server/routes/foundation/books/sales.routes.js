const express = require("express");
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
  return data.map((item, index) => [
    index + 1 || 0,
    item.book_name || "",
    item.book_code || "",
    item.book_price || 0,
    item.book_copies || 0,
    item.person_responsible || "",
    item.book_amount_expected || 0,
    item.book_amount_given || 0,
  ]);
}

module.exports = (pool, io) => {
  // Route for the Add Sale data modal
  router.post("/", async (req, res) => {
    const {
      book_name,
      book_code,
      book_price,
      book_copies,
      person_responsible,
      book_amount_expected,
      book_amount_given,
      book_status,
      authenticateJWT,
    } = req.body;
    try {
      pool.query(
        "INSERT INTO `book_sales`(`book_name`, `book_code`, `book_price`, `book_copies`, `person_responsible`, `book_amount_expected`, `book_amount_given`, `book_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          book_name,
          book_code,
          book_price,
          book_copies,
          person_responsible,
          book_amount_expected,
          book_amount_given,
          book_status,
        ],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message: "An error occurred while adding the Book Sale.",
            });
          }
          res.status(201).json({ message: "Book Sale added successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the Book Sale.",
      });
    }
  });
  //   Route to get Sales Data
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM book_sales", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the Book Sale",
      });
    }
  });
  router.get("/download-pdf", async (req, res) => {
    try {
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;
      const query = `SELECT * FROM book_sales WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC;`;

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
                      text: "Name Of the Book",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
                    },
                    {
                      text: "Code of The Book",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
                    },
                    {
                      text: "Price of the Book",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
                    },
                    {
                      text: "Copies of the Book",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
                    },
                    {
                      text: "Person In Charge",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
                    },
                    {
                      text: "Amount Expected",
                      fillColor: "#202A44",
                      style: "tableHeader",
                      bold: true,
                    },
                    {
                      text: "Amount Given",
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
       // Populate the body array with your dataToPdfRows
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
