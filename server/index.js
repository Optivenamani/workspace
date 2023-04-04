const express = require("express");
const mysql = require("mysql2");
const app = express();

const connection = mysql.createConnection({
  user: "doadmin",
  password: "AVNS_r83MmKjINtd5qaznvHw",
  host: "db-mysql-optiven-do-user-12885265-0.b.db.ondigitalocean.com",
  port: 25060,
  database: "defaultdb",
  ssl: { rejectUnauthorized: false },
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database!");
});

app.get("/", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
