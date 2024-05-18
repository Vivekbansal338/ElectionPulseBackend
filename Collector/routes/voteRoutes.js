import express from "express";
import { createVote } from "../controllers/voteControllers.js";
import { verifyWithId } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyWithId, createVote);

export default router;
