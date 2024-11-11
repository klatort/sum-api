const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  institution_id: { type: String, required: true, unique: true },
  apiKeyId: { type: String, required: true, unique: true },
  apiSecretHash: { type: String, required: true, unique: true },
  studentName: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

module.exports = User;