const tough = require("tough-cookie");

const configureRequest = (req, res, next) => {
  const requiredCookies = ["JSESSIONID", "HWWAFSESID", "HWWAFSESTIME", "8390ce12805d422a96ff76763b01e900"];
  const cookies = req.headers["cookie"]
    ? req.headers["cookie"].split(";").map((cookie) => {
        const [key, value] = cookie.trim().split("=");
        return { key, value };
      })
    : [];

  const cookieJar = new tough.CookieJar();

  // Filter and add only the required cookies to the cookie jar
  requiredCookies.forEach((requiredCookie) => {
    const cookie = cookies.find((c) => c.key === requiredCookie);
    if (cookie) {
      const toughCookie = new tough.Cookie({
        key: cookie.key,
        value: cookie.value,  
        domain: "sum.unmsm.edu.pe",
        path: "/",
        httpOnly: cookie.key === "JSESSIONID" || cookie.key === "8390ce12805d422a96ff76763b01e900",
        secure: cookie.key === "8390ce12805d422a96ff76763b01e900",
      });
      cookieJar.setCookieSync(toughCookie, "https://sum.unmsm.edu.pe");
    }
  });

  // Check if all required cookies are present
  const missingCookies = requiredCookies.filter((requiredCookie) => !cookies.some((c) => c.key === requiredCookie));
  if (missingCookies.length > 0) {
    return res.status(400).json({ message: `Missing required cookies: ${missingCookies.join(", ")}` });
  }

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
