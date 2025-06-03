const express = require("express");
const router = express.Router();
const Building = require("../esquema/building");

// Crear un nuevo edificio
router.post("/", async (req, res) => {
  const { name, departments } = req.body;

  if (!name || !departments || !Array.isArray(departments)) {
    return res.status(400).json({ error: "Nombre y departamentos son requeridos" });
  }

  try {
    const exists = await Building.findOne({ name });
    if (exists) {
      return res.status(409).json({ error: "El edificio ya existe" });
    }

    const newBuilding = new Building({ name, departments });
    await newBuilding.save();
    res.status(201).json({ message: "Edificio creado exitosamente" });
  } catch (err) {
    console.error("Error al crear edificio:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Obtener todos los edificios
router.get("/", async (req, res) => {
  try {
    const buildings = await Building.find();
    res.json(buildings);
  } catch (err) {
    console.error("Error al obtener edificios:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Obtener departamentos por ID de edificio
router.get("/:id/departments", async (req, res) => {
  const { id } = req.params;

  try {
    const building = await Building.findById(id);
    if (!building) {
      return res.status(404).json({ error: "Edificio no encontrado" });
    }
    res.json(building.departments);
  } catch (err) {
    console.error("Error al obtener departamentos:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
