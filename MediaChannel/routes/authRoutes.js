import express from "express";
import {
  MediaChannelSignup,
  MediaChannelLogin,
} from "../controllers/authControllers.js";

const router = express.Router();

// MediaChannel Signup
router.post("/signup", MediaChannelSignup);

// MediaChannel Login
router.post("/login", MediaChannelLogin);

export default router;
