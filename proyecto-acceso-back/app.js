//traemos librerias para el backend
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.Port || 5000;

//ruta para probar que funciona
app.get("/", (req, res) => {
    res.send("Hola Mundo!");
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})