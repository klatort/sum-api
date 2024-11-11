const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userSchema = require("../models/user");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const User = mongoose.model("User", userSchema);

module.exports = User;