// Traemos librerías para el backend
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.Port || 3500;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (solo una vez)
async function main() {
  await mongoose.connect(process.env.DB_CONECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
}
main().catch(console.error);

// Rutas principales
app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));
app.use("/api/user", require("./routes/user"));
app.use("/api/todos", require("./routes/todos"));
app.use("/api/refresh-token", require("./routes/refreshToken"));
app.use("/api/signout", require("./routes/signout"));
app.use("/api/owners", require("./routes/owners")); // Nueva ruta para propietarios

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Hola Mundo!");
});

// Ruta para registrar visitas (archivo JSON)
app.post("/api/visits", (req, res) => {
  const { fullName, company, reason, idNumber } = req.body;
  const filePath = path.join(__dirname, "visits.json");

  let visits = [];
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf8");
    visits = JSON.parse(fileData);
  }

  const newVisit = { fullName, company, reason, idNumber };
  visits.push(newVisit);

  fs.writeFileSync(filePath, JSON.stringify(visits, null, 2), "utf8");
  res.status(200).json({ message: "Visit registered successfully", filePath });
});

// Ruta para descargar el archivo de visitas
app.get("/api/visits-file", (req, res) => {
  const filePath = path.join(__dirname, "visits.json");
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
