const express = require("express");
const checkReferrer = require("../../public/middleware/authenticate");

dotenv.config();
const router = express.Router();

router.post("/register_policy", checkReferrer, async (req, res) => {
  const apiSecret = uuidv4();
  const hashedSecret = await bcrypt.hash(apiSecret, 12);

  switch (dotenv.parsed.REGISTRATION_POLICY) {
    case "EMAIL_CONFIRMATION":
      break;
    case "ADMIN_CONFIRMATION":
      break;
    case "NO_CONFIRMATION":
    default:
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        institution_id: req.body.institution_id,
        apiSecret: hashedSecret,
      });

      console.log(newUser);

      try {
        await newUser.save();
        res.status(201).json({ apiSecret });
      } catch (err) {
        res.status(500).json({ error: "Error creating the user" });
      }
  }
});

module.exports = router;
