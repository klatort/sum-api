const express = require("express");
const router = express.Router();
const dataController = require("../../../controllers/data_controller");
const authenticate = require("../../../middleware/authenticate");
const session = require("../../../middleware/config_session");

router.get(
  "/cursos",
  authenticate.authenticate,
  session.configureRequest,
  dataController.get_courses
);

module.exports = router;
