const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../esquema/user");
const getUserInfo = require("../lib/getUserInfo");

router.post("/", async (req, res) => {
    console.log("[LOGIN] Intento de login recibido");
    const { username, password } = req.body;
    console.log("[LOGIN] Datos recibidos:", username, password);

    if (!username || !password) {
        console.error("[LOGIN] Campos vacíos");
        return res.status(400).json(jsonResponse(400, {
            error: "Fields are required",
        }));
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.error("[LOGIN] Usuario no encontrado");
            return res.status(400).json(jsonResponse(400, {
                error: "User not found",
            }));
        }

        const correctPassword = await user.comparePassword(password, user.password);
        if (!correctPassword) {
            console.error("[LOGIN] Contraseña incorrecta");
            return res.status(400).json(jsonResponse(400, {
                error: "User or password incorrect",
            }));
        }

        const accessToken = user.createAccessToken();
        const refreshToken = await user.createRefreshToken();

        console.log("[LOGIN] Login exitoso");
        return res.status(200).json(jsonResponse(200, {
            user: getUserInfo(user),
            accessToken,
            refreshToken,
        }));
    } catch (err) {
        console.error("[LOGIN] Error interno:", err);
        return res.status(500).json(jsonResponse(500, {
            error: "Internal server error",
        }));
    }
});

module.exports = router;
