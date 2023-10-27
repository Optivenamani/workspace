const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Route for the Add Book Issue data modal
  router.post("/", async (req, res) => {
    const {
      book_name,
      book_code,
      book_price,
      book_copies,
      book_event,
      authenticateJWT,
    } = req.body;
    try {
      pool.query(
        "INSERT INTO `book_issuance`(`book_name`, `book_code`, `book_price`, `book_copies`, `book_event`) VALUES (?, ?, ?, ?, ?)",
        [book_name, book_code, book_price, book_copies, book_event],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message: "An error occurred while adding the Book Issue.",
            });
          }
          res.status(201).json({ message: "Book Issue added successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the Book Issue.",
      });
    }
  });
  //   Route to get Book Issue Data
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM book_issuance", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the Book Issue",
      });
    }
  });

  return router;
};
