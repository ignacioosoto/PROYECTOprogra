const express = require("express");
const router = express.Router();
const Owner = require("../esquema/owner"); // Use the correct path to your Owner model
const fs = require("fs");
const path = require("path");

// POST: Crear propietario (sin imagen)
router.post("/", async (req, res) => {
  const { fullName, rut, address } = req.body;

  if (!fullName || !rut || !address) {
    return res.status(400).json({ body: { error: "Todos los campos son obligatorios." } });
  }

  try {
    const existing = await Owner.findOne({ rut });
    if (existing) {
      return res.status(409).json({ body: { error: "El RUT ya está registrado." } });
    }

    const newOwner = new Owner({ fullName, rut, address });
    await newOwner.save();

    res.status(201).json({ message: "Propietario creado exitosamente" });
  } catch (err) {
    console.error("Error al guardar propietario:", err);
    res.status(500).json({ body: { error: "Error del servidor al guardar propietario" } });
  }
});

module.exports = router;