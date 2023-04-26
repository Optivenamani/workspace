// Load required modules and environment variables
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

// Set up the Express app and database connection pool
const app = express();
const pool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
});

// Check database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the database");
    connection.release();
  }
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
const clients = require("./routes/clients/clients.routes");

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
app.use("/api/login", login(pool));
app.use("/api/logout", logout);
app.use("/api/users", users(pool));
app.use("/api/sites", sites(pool));
app.use("/api/vehicles", vehicles(pool));
app.use("/api/site-visit-requests", siteVisitRequests(pool));
app.use("/api/site-visits", siteVisits(pool));
app.use("/api/drivers", drivers(pool));
app.use("/api/vehicle-requests", vehicleRequests(pool));
app.use("/api/clients", clients(pool));

// Define a sample route to fetch all users
app.get("/", (req, res) => {
  pool.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Listen for incoming requests
app.listen(8080, () => {
  console.log("Server started on port 8080");
});
