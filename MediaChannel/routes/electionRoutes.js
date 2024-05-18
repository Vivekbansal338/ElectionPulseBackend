import express from "express";
import {
  createElection,
  getElections,
  getElection,
  updateElection,
  getElectionStatus,
  changeElectionStatus,
  getSeatOverviewByElection,
} from "../controllers/electionControllers.js";
import { verifyWithId } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyWithId, createElection);
router.get("/", verifyWithId, getElections);
router.get("/:id", verifyWithId, getElection);
router.get("/status/:id", verifyWithId, getElectionStatus);
router.patch("/changestatus", verifyWithId, changeElectionStatus);
router.get("/overview/:electionId", getSeatOverviewByElection);
router.patch("/:id", verifyWithId, updateElection);

export default router;
