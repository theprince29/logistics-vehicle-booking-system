
import { connectDB } from "../configs/db.config.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`FleetLink API running on port ${PORT}`);
});
