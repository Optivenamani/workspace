// Load required modules and environment variables
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const app = express();

// Set up the Express app and database connection pool
const logisticsPool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.LOGISTICS_DB,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
});

// Set up the Express app and database connection pool
const visitorManagementPool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.VISITORS_MANAGEMENT_DB,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
});

// Check database connection
logisticsPool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the logistics database:", err.message);
  } else {
    console.log("Connected to the logistics database");
    connection.release();
  }
});

// Check database connection
visitorManagementPool.getConnection((err, connection) => {
  if (err) {
    console.error(
      "Error connecting to the visitors management database:",
      err.message
    );
  } else {
    console.log("Connected to the visitors management database");
    connection.release();
  }
});

// Create an HTTP server instance and attach the Express app to it
const server = http.createServer(app);

// Initialize a Socket.IO instance and attach it to the HTTP server
const io = socketIO(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://localhost:3000",
      "https://209.38.246.14/",
      "https://www.workspace.optiven.co.ke",
      "https://workspace.optiven.co.ke",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// Import auth routes
const login = require("./routes/auth/login.routes");
const logout = require("./routes/auth/logout.routes");
const users = require("./routes/auth/user.routes");

// Import logistics routes
const sites = require("./routes/logistics/sites/sites.routes");
const vehicles = require("./routes/logistics/vehicles/vehicles.routes");
const siteVisitRequests = require("./routes/logistics/site-visit-requests/siteVisitRequests.routes");
const siteVisits = require("./routes/logistics/site-visits/siteVisit.routes");
const drivers = require("./routes/logistics/drivers/drivers.routes");
const vehicleRequests = require("./routes/logistics/vehicle-requests/vehicleRequests.routes");
const clients = require("./routes/logistics/clients/clients.routes");
const notifications = require("./routes/logistics/notifications/notifications.routes");
const specialAssignment = require("./routes/logistics/special-assignment/specialAssignment.routes");

// Import visitors management routes
const visitors = require("./routes/visitors-management/visitors/visitors.routes");
const parking = require("./routes/visitors-management/parking-information/parking.routes");

// Configure CORS options
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://209.38.246.14/",
    "https://www.workspace.optiven.co.ke",
    "https://workspace.optiven.co.ke",
  ],
  allowedHeaders: ["Content-Type", "Authorization"],
};
// Apply middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Apply route middlewares
app.use("/api/login", login(logisticsPool));
app.use("/api/logout", logout);
app.use("/api/users", users(logisticsPool));
app.use("/api/sites", sites(logisticsPool));
app.use("/api/vehicles", vehicles(logisticsPool));
app.use("/api/site-visit-requests", siteVisitRequests(logisticsPool, io));
app.use("/api/site-visits", siteVisits(logisticsPool, io));
app.use("/api/drivers", drivers(logisticsPool));
app.use("/api/vehicle-requests", vehicleRequests(logisticsPool));
app.use("/api/clients", clients(logisticsPool));
app.use("/api/notifications", notifications(logisticsPool));
app.use("/api/visitors", visitors(visitorManagementPool));
app.use("/api/parking", parking(visitorManagementPool));
app.use("/api/special-assignments", specialAssignment(logisticsPool));

// Set up Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Connected");
  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

// Listen for incoming requests
server.listen(8080, () => {
  console.log("Server started on port 8080");
});
