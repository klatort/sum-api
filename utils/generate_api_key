const crypto = require("crypto");
const bcrypt = require("bcrypt");

async function generateAndHashApiKey() {
    const apiKey = crypto.randomBytes(16).toString("hex");
    const saltRounds = 12;
    const apiSecretHash = await bcrypt.hash(apiKey, saltRounds);
    return { apiKey, apiSecretHash };
}

module.exports = { generateAndHashApiKey };