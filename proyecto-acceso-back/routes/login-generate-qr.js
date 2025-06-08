const express = require("express");
const router = express.Router();
const Owner = require("../esquema/owner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");
const sendEmail = require("../lib/sendEmail"); // tu módulo nodemailer

const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_aqui";

router.post("/login-generate-qr", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Email y contraseña son obligatorios" });

    try {
        const owner = await Owner.findOne({ email }).select("+password");
        if (!owner) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });

        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });

        // Generar token JWT
        const token = jwt.sign(
            {
                userId: owner._id,
                email: owner.email,
                timestamp: Date.now(),
            },
            JWT_SECRET,
            { expiresIn: "10m" }
        );

        // Crear QR en formato data URL
        const qrDataURL = await QRCode.toDataURL(token);

        // Extraer base64 para adjuntar al mail
        const base64Data = qrDataURL.replace(/^data:image\/png;base64,/, "");

        // HTML para el correo con imagen embebida
        const html = `
            <p>Hola ${owner.fullName},</p>
            <p>Este es tu código QR de acceso (válido por 10 minutos):</p>
            <img src="cid:qrimage"/>
        `;

        // Adjuntar la imagen QR en el correo
        const attachments = [
            {
                filename: "qr.png",
                content: base64Data,
                encoding: "base64",
                cid: "qrimage",
            },
        ];

        try {
            // Enviar correo con QR
            await sendEmail(owner.email, "Tu código QR de acceso", html, attachments);
        } catch (emailErr) {
            console.error("Error detallado en sendEmail:", emailErr);  // Línea agregada para identificar error de envío
            return res.status(500).json({ error: "Error enviando el correo electrónico" });
        }

        // RESPONDEMOS SOLO UN MENSAJE (NO EL QR)
        return res.json({ message: "QR enviado por correo electrónico" });
    } catch (err) {
        console.error("Error en login-generate-qr:", err.message);
        console.error(err.stack);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
