import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacityKg: { type: Number, required: true },
  vehicleNo: { type: String, required: true, unique: true },
  tyres: { type: Number, required: true },
  route: { type: [String], required: true },
  available: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);