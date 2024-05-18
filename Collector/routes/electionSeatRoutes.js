import express from "express";
import {
  getElectionSeats,
  getElectionSeatInfoById,
  getElectionSeatStatsById,
} from "../controllers/electionSeatControllers.js";
import { verifyWithId } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyWithId, getElectionSeats);
router.get("/info/:id", verifyWithId, getElectionSeatInfoById);
router.get("/stats/:id", verifyWithId, getElectionSeatStatsById);

export default router;
