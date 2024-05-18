import express from "express";
import { loadSeatsFromFile } from "../controllers/seatControllers.js";
import { verifyWithId } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/load", loadSeatsFromFile);

export default router;
