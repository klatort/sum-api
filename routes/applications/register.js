const express = require("express");
const router = express.Router();
const user_controller = require("../../controllers/user_controller");

router.post("/create", express.json(), user_controller.createUser);

module.exports = router;
