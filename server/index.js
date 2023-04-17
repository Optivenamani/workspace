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
const login = require("./routes/auth/login.routes");
const logout = require("./routes/auth/logout.routes");
const users = require("./routes/auth/user.routes");
// Import other routes
const sites = require("./routes/sites/sites.routes");
const vehicles = require("./routes/vehicles/vehicles.routes");
const siteVisitRequests = require("./routes/site-visit-requests/siteVisitRequests.routes");
const siteVisits = require("./routes/site-visits/siteVisit.routes");
const drivers = require("./routes/drivers/drivers.routes");
const vehicleRequests = require("./routes/vehicle-requests/vehicleRequests.routes");

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
app.use("/api/login", login(connection));
app.use("/api/logout", logout);
app.use("/api/users", users(connection));
app.use("/api/sites", sites(connection));
app.use("/api/vehicles", vehicles(connection));
app.use("/api/site-visit-requests", siteVisitRequests(connection));
app.use("/api/site-visits", siteVisits(connection));
app.use("/api/drivers", drivers(connection));
app.use("/api/vehicle-requests", vehicleRequests(connection));

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
