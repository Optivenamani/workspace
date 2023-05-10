// Load required modules and environment variables
require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const socketIO = require("socket.io");
const app = express();

const privateKey = fs.readFileSync("./keys/private.key", "utf8");
const certificate = fs.readFileSync(
  "./keys/workspace_optiven_co_ke.crt",
  "utf8"
);
const ca = fs.readFileSync("./keys/workspace_optiven_co_ke.ca-bundle", "utf8");

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

// Set up the Express app and database connection pool
const pool = mysql.createPool({
  user: "doadmin",
  password: "AVNS_r83MmKjINtd5qaznvHw",
  host: "db-mysql-optiven-do-user-12885265-0.b.db.ondigitalocean.com",
  port: 25060,
  database: "defaultdb",
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

// Create an HTTP server instance and attach the Express app to it
const server = https.createServer(credentials, app);

// Initialize a Socket.IO instance and attach it to the HTTP server
const io = socketIO(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://optiven-logistics-zmest.ondigitalocean.app",
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
// Import other routes
const sites = require("./routes/sites/sites.routes");
const vehicles = require("./routes/vehicles/vehicles.routes");
const siteVisitRequests = require("./routes/site-visit-requests/siteVisitRequests.routes");
const siteVisits = require("./routes/site-visits/siteVisit.routes");
const drivers = require("./routes/drivers/drivers.routes");
const vehicleRequests = require("./routes/vehicle-requests/vehicleRequests.routes");
const clients = require("./routes/clients/clients.routes");
const notifications = require("./routes/notifications/notifications.routes");

// Configure CORS options
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://optiven-logistics-zmest.ondigitalocean.app",
  ],
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
app.use("/api/site-visit-requests", siteVisitRequests(pool, io));
app.use("/api/site-visits", siteVisits(pool, io));
app.use("/api/drivers", drivers(pool));
app.use("/api/vehicle-requests", vehicleRequests(pool));
app.use("/api/clients", clients(pool));
app.use("/api/notifications", notifications(pool));

// Set up Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Connected");

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
});

// Listen for incoming requests
server.listen(8080, () => {
  console.log("Server started on port 8080");
});
