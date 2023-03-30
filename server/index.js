const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
dotenv.config();

// Enable CORS for only http://localhost:3000
const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// const uri = process.env.MONGODB_URI;

// auth routes
const login = require("./routes/auth/login.routes");
const register = require("./routes/auth/register.routes");
const logout = require("./routes/auth/logout.routes");
const user = require("./routes/auth/user.routes");

// other routes

// middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// route middlewares
app.use("/api/login", login);
app.use("/api/register", register);
app.use("/api/logout", logout);
app.use("/api/me", user);

mongoose
  .connect("mongodb://127.0.0.1:27017/logisticsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(port, () => {
  console.log(`Express app is listening on port ${port}`);
});
