//traemos librerias para el backend
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.Port || 3500;

app.use(cors());
app.use(express.json());

async function main() {
    await mongoose.connect(process.env.DB_CONECTION_URL);
    console.log("Connected to MongoDB");
}

main().catch(console.error);

app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));
app.use("/api/user", require("./routes/user"));
app.use("/api/todos", require("./routes/todos"));
app.use("/api/refresh-token", require("./routes/refreshToken"));
app.use("/api/signout", require("./routes/signout"));


//ruta para probar que funciona
app.get("/", (req, res) => {
    res.send("Hola Mundo!");
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})
const fs = require("fs");
const path = require("path");

app.post("/api/visits", (req, res) => {
    const { fullName, company, reason, idNumber } = req.body;

    // Path to the file where data will be saved
    const filePath = path.join(__dirname, "visits.json");

    // Read existing data from the file (if it exists)
    let visits = [];
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, "utf8");
        visits = JSON.parse(fileData);
    }

    // Add the new visit to the array
    const newVisit = { fullName, company, reason, idNumber };
    visits.push(newVisit);

    // Save the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(visits, null, 2), "utf8");

    // Respond with success
    res.status(200).json({ message: "Visit registered successfully", filePath });
});
app.get("/api/visits-file", (req, res) => {
    const filePath = path.join(__dirname, "visits.json");
    if (fs.existsSync(filePath)) {
        res.download(filePath); // Send the file to the client
    } else {
        res.status(404).json({ error: "File not found" });
    }
});