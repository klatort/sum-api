const tough = require("tough-cookie");

const configureRequest = (req, res, next) => {
  const { cookies } = req.body;
  const cookieJar = new tough.CookieJar();

  if (!cookies) {
    return res.status(400).json({ message: "Session token is required" });
  }

  // Add the session token to the cookie jar
  cookies.forEach((cookie) => {
    const toughCookie = new tough.Cookie({
      key: cookie.key,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      expires: cookie.expires ? new Date(cookie.expires) : "Infinity",
    });
    cookieJar.setCookieSync(toughCookie, "https://sum.unmsm.edu.pe");
  });

  req.config = {
    jar: cookieJar,
    withCredentials: true,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  next();
};

module.exports = { configureRequest };
