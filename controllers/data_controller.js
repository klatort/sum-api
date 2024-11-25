const axios = require("axios");
const process = require("../utils/process_data");

const get_courses = async (req, res) => {
  const config = req.config;

  try {
    const courses_dirty = await axios.get(
      "https://sum.unmsm.edu.pe/alumnoWebSum/v2/reportes/matricula?accion=obtenerAlumnoMatricula",
      config
    );
    const courses = process.processDataCourses(courses_dirty.data);
    res.json({ courses: courses });
  } catch (error) {
    console.error("Error fetching courses", error);
    res.status(500).json({ message: "Unexpected error has occurred!" });
  }
};

module.exports = { get_courses };
