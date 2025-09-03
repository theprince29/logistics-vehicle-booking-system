function calculateRideDuration(fromPincode, toPincode) {
  return Math.abs(parseInt(toPincode) - parseInt(fromPincode)) % 24;
}

export default calculateRideDuration;