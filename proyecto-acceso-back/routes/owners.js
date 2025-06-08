const express = require("express");
const router = express.Router();
const Owner = require("../esquema/owner");
const sendEmail = require("../lib/sendEmail");
const bcrypt = require("bcryptjs");

// Crear propietario con vector facial
router.post("/with-face", async (req, res) => {
  const { fullName, rut, buildingId, department, email, faceDescriptor, password } = req.body;

  if (
    !fullName ||
    !rut ||
    !buildingId ||
    !department ||
    !email ||
    !faceDescriptor ||
    faceDescriptor.length !== 128 ||
    !password
  ) {
    return res.status(400).json({ body: { error: "Todos los campos, el vector y la contraseña son obligatorios" } });
  }

  try {
    const exists = await Owner.findOne({ rut });
    if (exists) {
      return res.status(409).json({ body: { error: "El RUT ya está registrado" } });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newOwner = new Owner({
      fullName,
      rut,
      email,
      faceDescriptor,
      buildingId,
      department,
      password: hashedPassword, // Guardar solo el hash aquí
    });

    await newOwner.save();

    const htmlContent = `
      <h1>Bienvenido a su departamento, ${fullName}</h1>
      <p>Su registro se ha realizado correctamente. Puede comenzar a utilizar el sistema de acceso.</p>
    `;

    await sendEmail(email, "Confirmación de Registro", htmlContent);

    res.status(201).json({ message: "Propietario creado exitosamente con vector facial, contraseña y correo enviado" });
  } catch (err) {
    console.error("Error al guardar propietario:", err);
    res.status(500).json({ body: { error: "Error del servidor" } });
  }
});

// Verificación facial
const euclideanDistance = (v1, v2) => {
  return Math.sqrt(v1.reduce((sum, val, i) => sum + Math.pow(val - v2[i], 2), 0));
};

router.post("/verify-face", async (req, res) => {
  const { descriptor } = req.body;

  if (!descriptor || descriptor.length !== 128) {
    return res.status(400).json({ error: "Vector facial inválido" });
  }

  try {
    const owners = await Owner.find({ faceDescriptor: { $exists: true } }).populate("buildingId");


    let bestMatch = null;
    let minDistance = Infinity;

    for (const owner of owners) {
      const distance = euclideanDistance(descriptor, owner.faceDescriptor);
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = owner;
      }
    }

    if (minDistance < 0.6) {
      return res.json({
        success: true,
        owner: {
          fullName: bestMatch.fullName,
          building: bestMatch.buildingId?.name || "Desconocido",
          department: bestMatch.department,
        },
      });

    } else {
      return res.json({ success: false, message: "Acceso denegado: rostro no reconocido" });
    }
  } catch (err) {
    console.error("Error en verificación facial:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
