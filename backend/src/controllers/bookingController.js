import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import calculateRideDuration from "../utils/duration.js";


export const createBooking = async (req, res) => {
  try {
    const { vehicleId, customerId, fromPincode, toPincode, startTime } = req.body;
    const duration = calculateRideDuration(fromPincode, toPincode);
    const endTime = new Date(new Date(startTime).getTime() + duration * 3600000);

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    const conflict = await Booking.findOne({
      vehicleId,
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
    });
    if (conflict) return res.status(409).json({ error: "Vehicle already booked" });

    const booking = await Booking.create({
      vehicleId, customerId, fromPincode, toPincode, startTime, endTime
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking deleted successfully",
      deletedBooking: booking
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};