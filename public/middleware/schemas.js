const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    institution_id: String,
    apiSecret: String
});

module.exports = userSchema;