const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Route for the Add Sale data modal
  router.post("/", async (req, res) => {
    const {
      book_name,
      book_code,
      book_price,
      book_copies,
      book_amount_expected,
      book_amount_given,
      authenticateJWT,
    } = req.body;
    try {
      pool.query(
        "INSERT INTO `book_sales`(`book_name`, `book_code`, `book_price`, `book_copies`, `book_amount_expected`, `book_amount_given`) VALUES (?, ?, ?, ?, ?, ?)",
        [
          book_name,
          book_code,
          book_price,
          book_copies,
          book_amount_expected,
          book_amount_given,
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

  return router;
};
