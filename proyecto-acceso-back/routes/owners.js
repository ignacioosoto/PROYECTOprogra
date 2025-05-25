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
