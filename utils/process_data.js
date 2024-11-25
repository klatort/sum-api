const processDataCourses = (data) => {
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

module.exports = { processDataCourses };
