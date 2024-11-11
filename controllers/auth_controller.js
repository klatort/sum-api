const axios = require("axios");

const loginPage = (req, res) => {
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
};

const login = async (req, res) => {
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
    // Respond with a success message
    res.send(`<p>Login successful!</p><p>Welcome, ${req.body.user}!</p>`);
  } catch (error) {
    console.log("Error in login", error);
    // Respond with an error message
    res
      .status(401)
      .send(`<p>Unexpected error has occurred!</p><p>${error}</p>`);
  }
};

module.exports = { loginPage, login };
