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

// Set up the Express app and database connection pool
const workplanAutomationPool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.WORKPLAN_AUTOMATION_DB,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
});

// Set up the Express app and database connection pool
const foundationPool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.FOUNDATION_DB,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
});

// Set up the Express app and database connection pool
const feedbackPool = mysql.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.FEEDBACK_DB,
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

// Check database connection
workplanAutomationPool.getConnection((err, connection) => {
  if (err) {
    console.error(
      "Error connecting to the workplan automation database:",
      err.message
    );
  } else {
    console.log("Connected to the workplan automation database");
    connection.release();
  }
});

// Check database connection
foundationPool.getConnection((err, connection) => {
  if (err) {
    console.error(
      "Error connecting to the foundation database:",
      err.message
    );
  } else {
    console.log("Connected to the foundation database");
    connection.release();
  }
});

// Check database connection
feedbackPool.getConnection((err, connection) => {
  if (err) {
    console.error(
      "Error connecting to the feedback database:",
      err.message
    );
  } else {
    console.log("Connected to the feedback database");
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
const users = require("./routes/auth/users.routes");

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
const interviews = require("./routes/visitors-management/interviews/interview.routes");
const parking = require("../server/routes/visitors-management/parking/parking.routes");

// Import workplan automation routes
const workplan = require("./routes/workplan-automation/workplan.routes");
const workplanActivities = require("./routes/workplan-automation/workplan_activities.routes");
const workplanReports = require("./routes/workplan-automation/workplan_reports.routes");

// Import feedback routes
const feedback = require("./routes/feedback/feedback.routes");

// Import Map routes
const plots = require("./routes/maps/plots.routes");

// Import Foundation routes
const events = require("./routes/foundation/events/events.routes");
const donors = require("./routes/foundation/donors/donors.routes");
const education = require("./routes/foundation/pillars/education.routes");
const environment = require("./routes/foundation/pillars/environment.routes");
const health = require("./routes/foundation/pillars/health.routes");
const poverty = require("./routes/foundation/pillars/poverty.routes");
const books = require("./routes/foundation/books/books.routes");
const issuance = require("./routes/foundation/books/issuance.routes");
const sales = require("./routes/foundation/books/sales.routes");
const amounts = require("./routes/foundation/pillars/amounts.routes");

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
app.use("/api/special-assignments", specialAssignment(logisticsPool));
app.use("/api/interviews", interviews(visitorManagementPool));
app.use("/api/workplans", workplan(workplanAutomationPool));
app.use("/api/workplan-activities", workplanActivities(workplanAutomationPool));
app.use("/api/workplan-reports", workplanReports(workplanAutomationPool));
app.use("/api/reserve-parking", parking(visitorManagementPool));
app.use("/api/reserved-parking", parking(visitorManagementPool));
app.use("/api/feedback", feedback(feedbackPool));
app.use("/api/events", events(foundationPool));
app.use("/api/donors", donors(foundationPool));
app.use("/api/education", education(foundationPool));
app.use("/api/environment", environment(foundationPool));
app.use("/api/health", health(foundationPool));
app.use("/api/poverty", poverty(foundationPool));
app.use("/api/books", books(foundationPool));
app.use("/api/issuance", issuance(foundationPool));
app.use("/api/sales", sales(foundationPool));
app.use("/api/amounts", amounts(foundationPool));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/plots", plots(logisticsPool));

// Set up Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Connected");
  socket.on("disconnect", () => {`1`
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
