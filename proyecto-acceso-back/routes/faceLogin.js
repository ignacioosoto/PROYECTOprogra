const router = require("express").Router();
const { jsonResponse } = require("../lib/jsonResponse");
const User = require("../esquema/user");
const faceapi = require("@vladmandic/face-api");
const canvas = require("canvas");

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
  await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
}

loadModels();

router.post("/", async (req, res) => {
  const { faceImage } = req.body;

  if (!faceImage) return res.status(400).json(jsonResponse(400, { error: "Imagen requerida" }));

  const imgBuffer = Buffer.from(faceImage.split(",")[1], "base64");
  const img = await canvas.loadImage(imgBuffer);
  const queryDescriptor = await faceapi
    .detectSingleFace(img)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!queryDescriptor) {
    return res.status(400).json(jsonResponse(400, { error: "No se detectó rostro válido" }));
  }

  const users = await User.find({});
  for (const user of users) {
    const userImgBuffer = Buffer.from(user.faceImage.split(",")[1], "base64");
    const userImg = await canvas.loadImage(userImgBuffer);
    const userDescriptor = await faceapi
      .detectSingleFace(userImg)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!userDescriptor) continue;

    const distance = faceapi.euclideanDistance(queryDescriptor.descriptor, userDescriptor.descriptor);
    if (distance < 0.5) {
      return res.status(200).json(jsonResponse(200, { message: "Autenticado", user: user.username }));
    }
  }

  return res.status(401).json(jsonResponse(401, { error: "No coincidencias encontradas" }));
});

module.exports = router;
