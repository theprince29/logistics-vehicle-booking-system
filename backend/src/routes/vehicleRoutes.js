import express from "express";
import { addVehicle, getAvailableVehicles } from "../controllers/vehicleController.js";

const router = express.Router();

router.post("/", addVehicle);
router.get("/available", getAvailableVehicles);

export default router;
