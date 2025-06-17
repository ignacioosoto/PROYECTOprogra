const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Owner = require("../esquema/owner");
const AccessLog = require("../esquema/AccessLog");  // <-- AÑADIMOS ESTO

const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_aqui";

router.post("/validate-qr", async (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(400).json({ error: "Token QR requerido" });

    try {
        // Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET);

        const owner = await Owner.findById(decoded.userId).populate("buildingId");
        if (!owner) return res.status(404).json({ error: "Propietario no encontrado" });

        // ✅ Registrar el acceso en AccessLog
        const newLog = new AccessLog({
            userId: owner._id,
            fullName: owner.fullName,
            building: owner.buildingId.name,
            department: owner.department,
            accessPoint: "Ingreso por QR"  // podemos indicar que fue QR
        });

        await newLog.save();

        // ✅ Devolver respuesta
        return res.json({ message: "Acceso autorizado", owner: { id: owner._id, name: owner.fullName } });

    } catch (err) {
        console.error("Error al validar QR:", err.message);
        return res.status(401).json({ error: "QR inválido o expirado" });
    }
});

module.exports = router;
