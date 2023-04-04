require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database!");
});

// auth routes
const login = require("./routes/auth/login.routes");
const logout = require("./routes/auth/logout.routes");
const me = require("./routes/auth/user.routes");

// Enable CORS for only http://localhost:3000
const corsOptions = {
  origin: "http://localhost:3000",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// route middlewares
app.use("/api/login", login(connection));
app.use("/api/logout", logout);
app.use("/api/me", me(connection));

app.get("/", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
