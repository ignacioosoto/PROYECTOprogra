const express = require("express");
const router = express.Router();
const Owner = require("../esquema/owner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");

const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_aqui";

router.post("/login-generate-qr", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Email y contraseña son obligatorios" });

    try {
        // Traer password aunque esté select:false
        const owner = await Owner.findOne({ email }).select("+password");
        if (!owner) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });

        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });

        const token = jwt.sign(
            {
                userId: owner._id,
                email: owner.email,
                timestamp: Date.now(),
            },
            JWT_SECRET,
            { expiresIn: "10m" }
        );

        const qrDataURL = await QRCode.toDataURL(token);

        return res.json({ qr: qrDataURL });
    } catch (err) {
        console.error("Error en login-generate-qr:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
