import express from "express";
import {
  CollectorLogin,
  sendVerifyOTP,
  submitVerifyOTP,
} from "../controllers/authControllers.js";
import { verifyWithId } from "../middlewares/authMiddleware.js";

const router = express.Router();

// analyst login
router.post("/login", CollectorLogin);
router.post("/sendverifyotp", verifyWithId, sendVerifyOTP);
router.post("/submitverifyotp", verifyWithId, submitVerifyOTP);

export default router;
