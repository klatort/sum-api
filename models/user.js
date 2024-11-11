const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    institution_id: { type: String, required: true, unique: true },
    apiSecret: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
module.exports = userSchema;