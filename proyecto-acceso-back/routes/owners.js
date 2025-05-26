const express = require("express");
const router = express.Router();
const Owner = require("../esquema/owner");

// Ruta para crear propietario con vector facial
router.post("/with-face", async (req, res) => {
  const { fullName, rut, address, descriptor } = req.body;

  if (!fullName || !rut || !address || !descriptor || descriptor.length !== 128) {
    return res.status(400).json({ body: { error: "Todos los campos y el vector son obligatorios" } });
  }

  try {
    const exists = await Owner.findOne({ rut });
    if (exists) {
      return res.status(409).json({ body: { error: "El RUT ya está registrado" } });
    }

    const newOwner = new Owner({
      fullName,
      rut,
      address,
      faceDescriptor: descriptor,
    });

    await newOwner.save();
    res.status(201).json({ message: "Propietario creado exitosamente con vector facial" });
  } catch (err) {
    console.error("Error al guardar propietario:", err);
    res.status(500).json({ body: { error: "Error del servidor" } });
  }
});

module.exports = router;
const euclideanDistance = (v1, v2) => {
  return Math.sqrt(v1.reduce((sum, val, i) => sum + Math.pow(val - v2[i], 2), 0));
};

router.post("/verify-face", async (req, res) => {
  const { descriptor } = req.body;

  if (!descriptor || descriptor.length !== 128) {
    return res.status(400).json({ error: "Vector facial inválido" });
  }

  try {
    const owners = await Owner.find({ faceDescriptor: { $exists: true } });

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
          address: bestMatch.address,
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
