import express from "express";
import { getAllSeats } from "../controllers/seatControllers.js";
import { verifyWithId } from "../middlewares/authMiddleware.js";

const router = express.Router();

// // getall seats
router.get("/", verifyWithId, getAllSeats);

// get seats by seat id

// get available seats by  election id

export default router;
