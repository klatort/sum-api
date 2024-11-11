const User = require("../models/user"); 
const bcrypt = require("bcrypt");

// Middleware to authenticate API requests
const authenticate = async (req, res, next) => {
  const apiKeyId = req.headers["x-api-key-id"];
  const apiSecret = req.headers["x-api-secret"];
  
  if (!apiKeyId || !apiSecret) {
    return res.status(403).json({ error: "API key ID and secret must be provided" });
  }

  try {
    // Find the user by the API key ID
    const user = await User.findOne({ apiKeyId: apiKeyId });
    if (!user) {
      return res.status(403).json({ error: "Invalid API key ID" });
    }

    // Compare the provided API secret with the stored hash
    const isMatch = await bcrypt.compare(apiSecret, user.apiSecretHash);
    if (!isMatch) {
      return res.status(403).json({ error: "Invalid API secret" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Middleware to check the referrer
const checkReferrer = (route) => (req, res, next) => {
  const referrer = req.headers.referer;
  if (referrer?.includes(route)) {
    next();
  } else {
    res.status(403).json({ error: "Access denied" });
  }
};

module.exports = { authenticate, checkReferrer };
