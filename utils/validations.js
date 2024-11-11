const puppeteer = require('puppeteer');

const validateStudent = async (institution_id) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const sanitizedInstitutionId = institution_id.replace(/\D/g, "");

  try {
    await page.goto("http://websecgen.unmsm.edu.pe/carne/carne.aspx");
    await page.type("#ctl00_ContentPlaceHolder1_txtUsuario", sanitizedInstitutionId);
    await page.click("#ctl00_ContentPlaceHolder1_cmdConsultar");
    await page.waitForFunction(() => {
      const input = document.getElementById("ctl00_ContentPlaceHolder1_txtAlumno");
      return input && input.value.length > 0;
    });

    const studentName = await page.evaluate(() => {
      const input = document.getElementById("ctl00_ContentPlaceHolder1_txtAlumno");
      return input ? input.value : "N/A";
    });

    await browser.close();

    return {
      studentCode: sanitizedInstitutionId,
      studentName: studentName.length < 3 ? "N/A" : studentName,
    };
  } catch (error) {
    await browser.close();
    console.error("Error validating student:", error);
    return { code: 500, error: "Student not found" };
  }
};

module.exports = { validateStudent };