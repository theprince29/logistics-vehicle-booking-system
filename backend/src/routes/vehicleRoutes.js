import express from "express";
import { addVehicle, getAllVehicles, getAvailableVehicles } from "../controllers/vehicleController.js";

const router = express.Router();

router.post("/", addVehicle);
router.get("/", getAllVehicles);
router.get("/available", getAvailableVehicles);

export default router;
