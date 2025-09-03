import calculateRideDuration from "../src/utils/duration";


describe("Ride Duration Calculation", () => {
  test("calculates positive difference modulo 24", () => {
    expect(calculateRideDuration("400001", "400010")).toBe(9);
  });

  test("handles reverse order correctly", () => {
    expect(calculateRideDuration("400010", "400001")).toBe(9);
  });

  test("modulo 24 keeps duration within a day", () => {
    expect(calculateRideDuration("400000", "400024")).toBe(0);
  });
});