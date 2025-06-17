const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "..", "access-log.json");

function loadLogs() {
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, "[]", "utf8");
  }
  return JSON.parse(fs.readFileSync(logFilePath, "utf8"));
}

function saveLog(entry) {
  const logs = loadLogs();
  logs.push(entry);
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), "utf8");
}

router.get("/", (req, res) => {
  try {
    const logs = loadLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Error al leer el historial" });
  }
});

router.post("/", (req, res) => {
  const { fullName, dateTime, method = "manual" } = req.body;

  if (!fullName || !dateTime) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const newEntry = { fullName, dateTime, method };

  try {
    saveLog(newEntry);
    res.status(201).json({ message: "Acceso registrado", entry: newEntry });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el acceso" });
  }
});

module.exports = router;
