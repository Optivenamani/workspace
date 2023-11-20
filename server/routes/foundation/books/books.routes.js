const express = require("express");
const authenticateJWT = require("../../../middleware/authenticateJWT");
const router = express.Router();

module.exports = (pool, io) => {
  // Route for the Add Book data modal
  router.post("/", async (req, res) => {
    const {
      book_name,
      book_code,
      book_price,
      book_copies,
      authenticateJWT,
    } = req.body;
    try {
      pool.query(
        "INSERT INTO `book_uploads`(`book_name`, `book_code`, `book_price`, `book_copies`) VALUES (?, ?, ?, ?)",
        [
          book_name,
          book_code,
          book_price,
          book_copies,
        ],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({
              message: "An error occurred while adding the Book.",
            });
          }
          res
            .status(201)
            .json({ message: "Book added successfully!" });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while adding the Book.",
      });
    }
  });
  //   Route to get Book Data
  router.get("/", async (req, res) => {
    try {
      pool.query("SELECT * FROM book_uploads", (err, results) => {
        if (err) throw err;

        res.json(results);
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the Book",
      });
    }
  });

  return router;
};
