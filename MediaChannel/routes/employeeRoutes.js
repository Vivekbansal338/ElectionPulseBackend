import express from "express";
import {
  CreateEmployee,
  getEmployees,
} from "../controllers/employeeControllers.js";
import { verifyWithId } from "../middlewares/authMiddleware.js";

const router = express.Router();

// create employee
router.post("/create-employee", verifyWithId, CreateEmployee);

// get employees
router.get("/", verifyWithId, getEmployees);

export default router;
