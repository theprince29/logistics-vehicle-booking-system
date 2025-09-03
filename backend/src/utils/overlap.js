export const overlapQuery = (vehicleId, startTime, endTime) => ({
vehicleId,
startTime: { $lt: endTime },
endTime: { $gt: startTime }
});