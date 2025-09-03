import { createBooking, deleteBooking, getAllBookings } from "../src/controllers/bookingController.js";
import Vehicle from "../src/models/Vehicle.js";
import Booking from "../src/models/Booking.js";

jest.mock("../src/models/Vehicle.js");
jest.mock("../src/models/Booking.js");

const mockReqRes = (body = {}, params = {}) => {
  const req = { body, params };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  return { req, res };
};

describe("createBooking", () => {
  test("creates booking when vehicle is available", async () => {
    Vehicle.findById.mockResolvedValue({ _id: "v1" });
    Booking.findOne.mockResolvedValue(null);
    Booking.create.mockResolvedValue({ _id: "b1", vehicleId: "v1" });

    const { req, res } = mockReqRes({
      vehicleId: "v1",
      customerId: "c1",
      fromPincode: "400001",
      toPincode: "400010",
      startTime: "2023-10-27T10:00:00Z"
    });

    await createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ _id: "b1" }));
  });

  test("returns 404 if vehicle not found", async () => {
    Vehicle.findById.mockResolvedValue(null);

    const { req, res } = mockReqRes({
      vehicleId: "v1",
      customerId: "c1",
      fromPincode: "400001",
      toPincode: "400010",
      startTime: "2023-10-27T10:00:00Z"
    });

    await createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Vehicle not found" });
  });

  test("returns 409 if booking conflict exists", async () => {
    Vehicle.findById.mockResolvedValue({ _id: "v1" });
    Booking.findOne.mockResolvedValue({ _id: "b1" });

    const { req, res } = mockReqRes({
      vehicleId: "v1",
      customerId: "c1",
      fromPincode: "400001",
      toPincode: "400010",
      startTime: "2023-10-27T10:00:00Z"
    });

    await createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: "Vehicle already booked" });
  });
});

describe("deleteBooking", () => {
  test("returns 400 for invalid ID", async () => {
    const { req, res } = mockReqRes({}, { id: "invalid-id" });

    await deleteBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid booking ID" });
  });

  test("returns 404 if booking not found", async () => {
    Booking.findByIdAndDelete.mockResolvedValue(null);
    const { req, res } = mockReqRes({}, { id: "64b4c8b2f3e2c1a2b3c4d5e6" });

    await deleteBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Booking not found" });
  });

  test("deletes booking successfully", async () => {
    const deleted = { _id: "b1", vehicleId: "v1" };
    Booking.findByIdAndDelete.mockResolvedValue(deleted);

    const { req, res } = mockReqRes({}, { id: "64b4c8b2f3e2c1a2b3c4d5e6" });

    await deleteBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Booking deleted successfully",
      deletedBooking: deleted
    });
  });
});

describe("getAllBookings", () => {
  test("returns all bookings", async () => {
    const mockBookings = [
      { _id: "b1", vehicleId: "v1" },
      { _id: "b2", vehicleId: "v2" }
    ];
    Booking.find.mockResolvedValue(mockBookings);

    const { req, res } = mockReqRes();

    await getAllBookings(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBookings);
  });

  test("handles error gracefully", async () => {
    Booking.find.mockRejectedValue(new Error("DB error"));

    const { req, res } = mockReqRes();

    await getAllBookings(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
  });
});
