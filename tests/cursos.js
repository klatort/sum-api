const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const tough = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const path = require("path");
const router = express.Router();

const cookieJar = new tough.CookieJar();
wrapper(axios);
router.use(express.static(path.join(__dirname, "../public")));

process_data = (data) => {
  return data.data.matricula.map((element) => ({
    carrera: element.desEscuela,
    plan: element.codPlan,
    ciclo: element.cicloEstudio,
    curso: element.desAsignatura,
    seccion: element.codSeccion,
    profesor:
      element.nomDocente +
      " " +
      element.apePatDocente +
      " " +
      element.apeMatDocente,
  }));
};

router.post("/cursos", async (req, res) => {
  // First request to get the csrf token
  try {
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
      login: req.body.user,
      clave: req.body.password,
    };
    const config = {
      jar: cookieJar,
      withCredentials: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    console.log("Login data", config.jar);

    // Second request to login and get the session cookie
    try {
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
        try {
          await axios.get(
            "https://sum.unmsm.edu.pe/alumnoWebSum/reiniciarSesion?us=" +
              loginData.login,
            config
          );
        } catch (error) {
          console.log("Error in reiniciarSesion", error);
          res.status(401).json({ message: "Unexpected error has occured!" });
        }
      }

      // Third request to get the user data
      try {
        const courses_dirty = await axios.get(
          "https://sum.unmsm.edu.pe/alumnoWebSum/v2/reportes/matricula?accion=obtenerAlumnoMatricula",
          config
        );
        console.log("Courses dirty", courses_dirty.data.data);
        const courses = process_data(courses_dirty.data);
        res.json({ courses: courses });
      } catch (error) {
        console.log("Error in reiniciarSesion ewe", error);
        res.status(401).json({ message: "Unexpected error has occured!" });
      }
    } catch (error) {
      res.status(401).json({ message: "Unexpected error has occured!" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unexpected error has occured!" });
  }
});

module.exports = router;
