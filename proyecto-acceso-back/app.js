require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3500;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.DB_CONECTION_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(console.error);

// Rutas
app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));
app.use("/api/user", require("./routes/user"));
app.use("/api/todos", require("./routes/todos"));
app.use("/api/refresh-token", require("./routes/refreshToken"));
app.use("/api/signout", require("./routes/signout"));
app.use("/api/owners", require("./routes/owners"));
app.use("/api/qr", require("./routes/login-generate-qr"));
app.use("/api/buildings", require("./routes/buildingRoutes"));
app.use("/api", require("./routes/validate-QR"));
app.use("/api/accesslog", require("./routes/accessLog"));

// Rutas de visita
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

app.get("/api/visits-file", (req, res) => {
    const filePath = path.join(__dirname, "visits.json");
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: "File not found" });
    }
});

app.get("/", (req, res) => res.send("Hola Mundo!"));

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
