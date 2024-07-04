// Middleware para autenticar las peticiones a la API
// y verificaciones en general, propablemente se haga
// más granular dependiendo qué tan complejo llegue a ser

const User = require("./db_connect.js");
const bcrypt = require("bcrypt");
const puppeteer = require("puppeteer");

const authenticate = async (req, res, next) => {
  const apiSecret = req.headers["x-api-secret"];
  if (!apiSecret) {
    return res.status(403).json({ error: "No API secret provided" });
  }

  try {
    const user = await User.findOne({ apiSecret });
    if (!user || !(await bcrypt.compare(apiSecret, user.apiSecret))) {
      return res.status(403).json({ error: "Invalid API secret" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: "Error verifying API secret" });
  }
};

// Middleware para revisar el referer
const checkReferrer = (req, res, next, route) => {
  const referrer = req.headers.referer;
  if (referrer && referrer.includes(route)) {
    next();
  } else {
    res.status(403).json({ error: "Acceso denegado" });
  }
};

const validateStudent = async (institutionId) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const sanitizedInstitutionId = institutionId.replace(/\D/g, "");

  await page.goto("http://websecgen.unmsm.edu.pe/carne/carne.aspx");
  await page.type(
    "#ctl00_ContentPlaceHolder1_txtUsuario",
    sanitizedInstitutionId
  );
  await page.click("#ctl00_ContentPlaceHolder1_cmdConsultar");
  await page.waitForFunction(() => {
    const input = document.getElementById(
      "ctl00_ContentPlaceHolder1_txtAlumno"
    );
    return input.value !== "";
  });

  const fetchedStudentName = await page.$eval(
    "#ctl00_ContentPlaceHolder1_txtAlumno",
    (input) => input.value
  );
  const fetchedStudentCode = await page.$eval(
    "#ctl00_ContentPlaceHolder1_txtUsuario",
    (input) => input.value
  );

  await browser.close();

  return {
    studentCode: fetchedStudentCode,
    studentName: fetchedStudentName.length < 3 ? "N/A" : fetchedStudentName,
  };
};

module.exports = { authenticate, checkReferrer, validateStudent };
