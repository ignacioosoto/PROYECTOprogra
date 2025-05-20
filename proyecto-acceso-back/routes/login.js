const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../esquema/user");
const getUserInfo = require("../lib/getUserInfo");

router.post("/", async (req, res) => {
  const { username, password, faceImage } = req.body;

  if (!username || !password || !faceImage) {
    return res.status(400).json(
      jsonResponse(400, {
        error: "Todos los campos son obligatorios (incluyendo imagen facial)",
      })
    );
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json(
      jsonResponse(400, {
        error: "Usuario no encontrado",
      })
    );
  }

  const passwordCorrecta = await user.comparePassword(password, user.password);

  if (!passwordCorrecta) {
    return res.status(400).json(
      jsonResponse(400, {
        error: "Usuario o contraseña incorrectos",
      })
    );
  }

  // Verificación facial básica (coincidencia exacta)
  if (user.faceImage !== faceImage) {
    return res.status(401).json(
      jsonResponse(401, {
        error: "La verificación facial falló",
      })
    );
  }

  const accessToken = user.createAccessToken();
  const refreshToken = await user.createRefreshToken();

  res.status(200).json(
    jsonResponse(200, {
      user: getUserInfo(user),
      accessToken,
      refreshToken,
    })
  );
});

module.exports = router;
