import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import calculateRideDuration from "../utils/duration.js";

export const addVehicle = async (req, res) => {
  try {
    const { name, capacityKg, tyres, available, route, vehicleNo } = req.body;
    if (!name || !capacityKg || !tyres || !available || !route || !vehicleNo) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const vehicle = await Vehicle.create({ name, capacityKg, tyres, available, route, vehicleNo });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ error: "Missing query params" });
    }

    const duration = calculateRideDuration(fromPincode, toPincode);
    const endTime = new Date(new Date(startTime).getTime() + duration * 3600000);

    const vehicles = await Vehicle.find({ capacityKg: { $gte: capacityRequired }, route: { $all: [fromPincode, toPincode] } });

    const available = [];
    for (const v of vehicles) {
      const conflict = await Booking.findOne({
        vehicleId: v._id,
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
      });
      if (!conflict) {
        available.push({ ...v.toObject(), estimatedRideDurationHours: duration });
      }
    }

    res.json(available);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
