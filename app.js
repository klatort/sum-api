const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/test", require("./tests/cursos"));
app.use("/login", require("./routes/applications/login"));
app.use("/register", require("./routes/applications/register"));
//app.use("/admin", require("./routes/admin/register_policy"));

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;