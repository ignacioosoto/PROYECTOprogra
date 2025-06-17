const express = require("express");
const router = express.Router();
const AccessLog = require("../esquema/AccessLog");

router.get("/", async (req, res) => {
  try {
    const { startDate, endDate, building } = req.query;
    let filter = {};

    // Filtro de fechas
    if (startDate && endDate && startDate !== "" && endDate !== "") {
      filter.entryTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Filtro de edificio (esto es lo que faltaba)
    if (building && building !== "") {
      filter.building = building;
    }

    const logs = await AccessLog.find(filter).sort({ entryTime: -1 });
    res.json(logs);
  } catch (err) {
    console.error("Error al obtener logs:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
