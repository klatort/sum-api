const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_secret_key"; // Use an environment variable for this in production

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

function verifyToken(token) {
  try {
    return { valid: true, payload: jwt.verify(token, SECRET_KEY) };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

module.exports = { generateToken, verifyToken };
