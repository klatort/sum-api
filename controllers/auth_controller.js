const axios = require("axios");
const cheerio = require("cheerio");
const tough = require("tough-cookie");

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
  const cookieJar = new tough.CookieJar();
  const { user, password } = req.body;
  try {
    // First request to get the CSRF token
    const response = await axios.get(
      "https://sum.unmsm.edu.pe/alumnoWebSum/login",
      {
        jar: cookieJar,
        withCredentials: true,
      }
    );
    const $ = cheerio.load(response.data);
    const csrfToken = $('input[name="_csrf"]').val();

    const loginData = {
      _csrf: csrfToken,
      login: user,
      clave: password,
    };
    const config = {
      jar: cookieJar,
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    // Second request to login and get the session cookie
    const resp = await axios.post(
      "https://sum.unmsm.edu.pe/alumnoWebSum/login",
      loginData,
      config
    );

    // If the user is already logged in, the session is restarted
    if (
      resp.request.res.responseUrl ===
      "https://sum.unmsm.edu.pe/alumnoWebSum/sesionIniciada"
    ) {
      await axios.get(
        `https://sum.unmsm.edu.pe/alumnoWebSum/reiniciarSesion?us=${loginData.login}`,
        config
      );
    }

    // Extract session token from cookies
    const cookies = cookieJar.getCookiesSync(
      "https://sum.unmsm.edu.pe/alumnoWebSum"
    );

    res.status(200).json({ cookies });
  } catch (error) {
    console.error("Error in getSessionToken", error);
    res.status(500).json({ message: "Failed to get session token" });
  }
};

module.exports = { loginPage, login };
