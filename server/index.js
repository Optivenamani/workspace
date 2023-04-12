// Load required modules and environment variables
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

// Set up the Express app and database connection
const app = express();
const connection = mysql.createConnection({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

// Handle connection errors
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database!");
});

// Import auth routes
const loginRoutes = require("./routes/auth/login.routes");
const logoutRoutes = require("./routes/auth/logout.routes");
const userRoutes = require("./routes/auth/user.routes");
// Import other routes
const siteVisitRoutes = require("./routes/site-visits/siteVisit.routes");
const siteRoutes = require("./routes/sites/sites.routes");
const driverRoutes = require("./routes/drivers/drivers.routes");

// Configure CORS options
const corsOptions = {
  origin: "http://localhost:3000",
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Apply route middlewares
app.use("/api/login", loginRoutes(connection));
app.use("/api/logout", logoutRoutes);
app.use("/api/me", userRoutes(connection));
app.use("/api/site-visits", siteVisitRoutes(connection));
app.use("/api/sites", siteRoutes(connection));
app.use("/api/drivers", driverRoutes(connection));

// Define a sample route to fetch all users
app.get("/", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Listen for incoming requests
app.listen(8080, () => {
  console.log("Server started on port 8080");
});
