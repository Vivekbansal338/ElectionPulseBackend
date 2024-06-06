import express from "express";
import {
  loadSeatsFromFile,
  loadCoordinatesFromFile,
  loadCoordinatesFromFileForAllSeats,
} from "../controllers/seatControllers.js";
import { verifyWithId } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/load", loadSeatsFromFile);
router.patch("/coordinates/:name", loadCoordinatesFromFile);
router.get("/load/coordinates", loadCoordinatesFromFileForAllSeats);

export default router;
