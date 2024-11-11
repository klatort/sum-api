const User = require("../config/db_connect.js");
const bcrypt = require("bcrypt");
const puppeteer = require("puppeteer");

// Middleware to authenticate API requests
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

// Middleware to check the referrer
const checkReferrer = (route) => (req, res, next) => {
  const referrer = req.headers.referer;
  if (referrer?.includes(route)) {
    next();
  } else {
    res.status(403).json({ error: "Access denied" });
  }
};

// Function to validate student information using Puppeteer
const validateStudent = async (institutionId) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const sanitizedInstitutionId = institutionId.replace(/\D/g, "");

  try {
    await page.goto("http://websecgen.unmsm.edu.pe/carne/carne.aspx");
    await page.type("#ctl00_ContentPlaceHolder1_txtUsuario", sanitizedInstitutionId);
    await page.click("#ctl00_ContentPlaceHolder1_cmdConsultar");
    await page.waitForFunction(() => {
      const input = document.getElementById("ctl00_ContentPlaceHolder1_txtAlumno");
      return input.value !== "";
    });

    const fetchedStudentName = await page.$eval("#ctl00_ContentPlaceHolder1_txtAlumno", (input) => input.value);
    const fetchedStudentCode = await page.$eval("#ctl00_ContentPlaceHolder1_txtUsuario", (input) => input.value);

    await browser.close();

    return {
      studentCode: fetchedStudentCode,
      studentName: fetchedStudentName.length < 3 ? "N/A" : fetchedStudentName,
    };
  } catch (error) {
    await browser.close();
    throw error;
  }
};

module.exports = { authenticate, checkReferrer, validateStudent };
