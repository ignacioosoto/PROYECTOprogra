// routes/validate-qr.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Owner = require("../esquema/owner");

const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_aqui";

router.post("/validate-qr", async (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(400).json({ error: "Token QR requerido" });

    try {
        // Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Puedes agregar validaciones adicionales aquí (por ejemplo, si el usuario existe)
        const owner = await Owner.findById(decoded.userId);
        if (!owner) return res.status(404).json({ error: "Propietario no encontrado" });

        // Validación exitosa
        return res.json({ message: "Acceso autorizado", owner: { id: owner._id, name: owner.fullName } });

    } catch (err) {
        console.error("Error al validar QR:", err.message);
        return res.status(401).json({ error: "QR inválido o expirado" });
    }
});

module.exports = router;
