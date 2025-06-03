const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  rut: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  email: { type: String, required: true }, // 👉 agregado aquí
  faceDescriptor: { type: [Number], required: false },
}, { timestamps: true });

module.exports = mongoose.model("Owner", ownerSchema);
