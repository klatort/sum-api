const User = require("../models/user");
const generate_api_key = require("../utils/generate_api_key");
const validation = require("../utils/validations");
const { v4: uuidv4 } = require("uuid");

const createUser = async (req, res) => {
  const { username, email, institution_id } = req.body;

  if (!username || !email || !institution_id) {
    return res
      .status(400)
      .json({ error: "All required fields must be provided" });
  }

  console.log("Validating student information...");
  try {
    const apiKeyId = uuidv4();
    const { apiKey, apiSecretHash } = await generate_api_key.generateAndHashApiKey();
    const { studentName } = await validation.validateStudent(institution_id);

    if (studentName == "N/A" || studentName == undefined) {
      return res.status(500).json({ error: "Student not found" });
    }

    // Create new user
    const user = new User({
      username,
      email,
      institution_id,
      apiKeyId,
      apiSecretHash,
      studentName,
    });

    await user.save();
    res
      .status(201)
      .json({
        message: "User created successfully",
        apiKeyId: apiKeyId,
        apiSecret: apiKey,
      });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ error: "Username, email or institution ID already in use" });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser };
