import express from "express";
import { getParties } from "../controllers/partyControllers.js";
import { verifyWithId } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", verifyWithId, getParties);

export default router;
