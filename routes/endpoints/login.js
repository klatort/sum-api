const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <form action="/login" method="post">
          <label for="user">User:</label><br>
          <input type="text" id="user" name="user" required><br>
          <label for="password">Password:</label><br>
          <input type="password" id="password" name="password" required><br><br>
          <input type="submit" value="Login">
        </form>
      </body>
    </html>
  `);
});

router.post("/", async (req, res) => {
  console.log("Received login request from", req.ip);

  const request_body = {
    clave: req.body.password,
    usuario: req.body.user,
  };
  
  try {
    const resp = await axios.post(
      "https://sumvirtual.unmsm.edu.pe/sumapi/loguearse",
      request_body
    );
    console.log(resp.data);
    res.status(201).json(resp.data);
  } catch (error) {
    console.log("Error in login", error);
    res.status(401).json({ message: "Unexpected error has occurred!" });
  }
});

module.exports = router;
