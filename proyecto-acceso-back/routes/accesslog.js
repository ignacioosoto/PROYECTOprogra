const express = require("express");
const router = express.Router();
const AccessLog = require("../esquema/AccessLog");

// Registrar entrada
router.post("/entry", async (req, res) => {
  try {
    const { userId, fullName, building, department, accessPoint } = req.body;
    const log = new AccessLog({ userId, fullName, building, department, accessPoint });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar salida
router.post("/exit/:id", async (req, res) => {
  try {
    const log = await AccessLog.findById(req.params.id);
    if (!log) return res.status(404).json({ error: "Registro no encontrado" });

    log.exitTime = new Date();
    await log.save();
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Consultar logs con filtros
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    let filter = {};

    if (startDate && endDate) {
      filter.entryTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (userId) {
      filter.fullName = userId;  // buscamos por nombre
    }

    const logs = await AccessLog.find(filter).sort({ entryTime: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
