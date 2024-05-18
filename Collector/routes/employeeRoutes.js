import express from "express";
import { getEmployeeProfile } from "../controllers/employeeControllers.js";
import { verifyWithId } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", verifyWithId, getEmployeeProfile);

export default router;
