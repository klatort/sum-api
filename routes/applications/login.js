const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth_controller");
const authenticate = require("../../middleware/authenticate");

router.get(
  "/login", 
  authenticate, 
  authController.loginPage
);

router.post(
  "/login",
  authenticate,
  express.urlencoded({ extended: true }),
  authController.login
);

module.exports = router;
