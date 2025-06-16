const mongoose = require("mongoose");

const AccessLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
  fullName: { type: String, required: true },
  building: { type: String, required: true },
  department: { type: String, required: true },
  accessPoint: { type: String, default: "Desconocido" },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date }
});

// 🛡 Protección contra OverwriteModelError:
module.exports = mongoose.models.AccessLog || mongoose.model("AccessLog", AccessLogSchema);
