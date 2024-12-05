const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./config/db_connect.js");

const app = express();

app.set("view engine", "ejs");

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin); // Allow all origins
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(bodyParser.json());

// Routes
app.use("/test", require("./tests/cursos"));
app.use("/user", require("./routes/applications/login"));
app.use("/user", require("./routes/applications/register"));
app.use("/user", require("./routes/applications/operations/cursos"));
//app.use("/admin", require("./routes/admin/register_policy"));

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
const HOST = 'localhost' // Only listen to requests from localhost to expose via reverse proxy for security reasons

app.listen(PORT, HOST,  () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
