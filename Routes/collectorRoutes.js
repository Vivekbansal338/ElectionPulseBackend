import express from "express";
import authRoutes from "../Collector/routes/authRoutes.js";
import electionSeatRoutes from "../Collector/routes/electionSeatRoutes.js";
import employeeRoutes from "../Collector/routes/employeeRoutes.js";
import voteRoutes from "../Collector/routes/voteRoutes.js";

const router = express.Router();

router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/electionseats", electionSeatRoutes);
router.use("/api/v1/employee", employeeRoutes);
router.use("/api/v1/vote", voteRoutes);

export default router;
