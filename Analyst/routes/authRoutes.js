import express from "express";
import {
  AnalystLogin,
} from "../controllers/authControllers.js";

const router = express.Router();

// analyst login
router.post("/login", AnalystLogin);    

export default router;
