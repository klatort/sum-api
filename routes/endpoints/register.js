const express = require("express");
const { validateStudent } = require("../../public/middleware/authenticate");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../../public/middleware/db_connect.js");
const dotenv = require("dotenv");

const router = express.Router();
dotenv.config();

router.post("/", async (req, res) => {
  if (!req.body.email.endsWith("@unmsm.com.pe")) {
    return res.status(400).json({ error: "Correo inválido" });
  }
  const { studentCode, studentName } = await validateStudent(
    req.body.institution_id
  );

  console.log("Student code is", studentCode);
  console.log("Student name is", studentName);

  // Por algún motivo cuando no encuentra el alumno,
  // el nombre responde con un string de 2 caracteres
  // invisibles (probablemente un espacio y un salto de línea)

  if (studentName.length < 3) {
    return res.status(400).json({ error: "Codigo de alumno inválido" });
  }

  if (studentName !== req.body.name.toUpperCase()) {
    return res.status(400).json({ error: "Nombre de alumno inválido" });
  }

  // Validación correcta! Ahora crear registrar al usuario
  const apiSecret = uuidv4();
  const hashedSecret = await bcrypt.hash(apiSecret, 12);

  switch (process.env.REGISTRATION_POLICY) {
    case "EMAIL_CONFIRMATION":
      break;
    case "ADMIN_CONFIRMATION":
      break;
    case "NO_CONFIRMATION":
    default:
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        institution_id: req.body.institution_id,
        apiSecret: hashedSecret,
      });

      console.log(newUser);

      try {
        await newUser.save();
        res.status(201).json({ apiSecret });
      } catch (err) {
        res.status(500).json({ error: "Error creating the user" });
      }
  }
});

module.exports = router;
