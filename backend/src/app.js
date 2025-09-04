import express from "express";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import dotenv from  "dotenv";
import cors from "cors";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;
