require("dotenv").config(); // Carga variables de entorno primero

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const buildingRoutes = require("./routes/buildingRoutes");
const loginQRRouter = require("./routes/login-generate-qr");
const accessLogRoutes = require("./routes/accessLog");
const app = express();
const port = process.env.PORT || 3500;

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.DB_CONECTION_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

// Rutas API
app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));
app.use("/api/user", require("./routes/user"));
app.use("/api/todos", require("./routes/todos"));
app.use("/api/refresh-token", require("./routes/refreshToken"));
app.use("/api/signout", require("./routes/signout"));
app.use("/api/owners", require("./routes/owners"));
app.use("/api/qr", loginQRRouter);
app.use("/api/buildings", buildingRoutes);
app.use("/api/accesslog", accessLogRoutes);
// Ruta base
app.get("/", (req, res) => res.send("Hola Mundo!"));

// Registro de visitas
app.post("/api/visits", (req, res) => {
  const { fullName, company, reason, idNumber } = req.body;
  const filePath = path.join(__dirname, "visits.json");

  let visits = [];
  if (fs.existsSync(filePath)) {
    visits = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  const newVisit = { fullName, company, reason, idNumber };
  visits.push(newVisit);

  fs.writeFileSync(filePath, JSON.stringify(visits, null, 2), "utf8");
  res.status(200).json({ message: "Visit registered successfully", filePath });
});

// Descarga de archivo de visitas
app.get("/api/visits-file", (req, res) => {
  const filePath = path.join(__dirname, "visits.json");

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "File not found" });
  }
});

// Levantar servidor
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
