const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  rut: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  faceDescriptor: { type: [Number], required: false },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: "Building", required: true },
  department: { type: String, required: true },
  password: { type: String, required: true, select: false } // contraseña no se selecciona por defecto
}, { timestamps: true });

module.exports = mongoose.model("Owner", ownerSchema);
