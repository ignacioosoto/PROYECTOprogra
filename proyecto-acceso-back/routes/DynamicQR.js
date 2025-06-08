const express = require("express");
const router = express.Router();
const Owner = require("../esquema/owner");
const bcrypt = require("bcryptjs");

// Endpoint para verificar datos del QR dinámico
router.post("/verify-qr", async (req, res) => {
    const { fullName, password } = req.body;

    if (!fullName || !password) {
        return res.status(400).json({ error: "Nombre completo y contraseña son obligatorios" });
    }

    try {
        // Busca por fullName
        const owner = await Owner.findOne({ fullName }).populate("buildingId");

        if (!owner) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(password, owner.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // Datos que enviará al frontend para generar el QR
        return res.json({
            fullName: owner.fullName,
            building: owner.buildingId?.name || "Desconocido",
            department: owner.department,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error("Error en verificación QR:", err);
        return res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;