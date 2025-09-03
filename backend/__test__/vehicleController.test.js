import { getAvailableVehicles } from "../src/controllers/vehicleController.js";
import Vehicle from "../src/models/Vehicle.js";
import Booking from "../src/models/Booking.js";

jest.mock("../src/models/Vehicle.js");
jest.mock("../src/models/Booking.js");

const mockReqRes = (query) => {
  const req = { query };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  return { req, res };
};

describe("getAvailableVehicles", () => {
  test("returns available vehicles when no booking conflicts", async () => {
    Vehicle.find.mockResolvedValue([
      { _id: "v1", toObject: () => ({ _id: "v1", name: "Truck A", capacityKg: 1000 }) }
    ]);
    Booking.findOne.mockResolvedValue(null);

    const { req, res } = mockReqRes({
      capacityRequired: 500,
      fromPincode: "400001",
      toPincode: "400010",
      startTime: "2023-10-27T10:00:00Z"
    });

    await getAvailableVehicles(req, res);

    expect(res.json).toHaveBeenCalledWith([
      expect.objectContaining({
        _id: "v1",
        estimatedRideDurationHours: 9
      })
    ]);
  });

  test("filters out vehicles with conflicting bookings", async () => {
    Vehicle.find.mockResolvedValue([
      { _id: "v1", toObject: () => ({ _id: "v1", name: "Truck A", capacityKg: 1000 }) }
    ]);
    Booking.findOne.mockResolvedValue({ _id: "b1" }); // conflict found

    const { req, res } = mockReqRes({
      capacityRequired: 500,
      fromPincode: "400001",
      toPincode: "400010",
      startTime: "2023-10-27T10:00:00Z"
    });

    await getAvailableVehicles(req, res);

    expect(res.json).toHaveBeenCalledWith([]);
  });
});
