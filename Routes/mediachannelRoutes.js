import express from "express";
import authRoutes from "../MediaChannel/routes/authRoutes.js";
import electionRoutes from "../MediaChannel/routes/electionRoutes.js";
import tagRoutes from "../MediaChannel/routes/tagRoutes.js";
import partyRoutes from "../MediaChannel/routes/partyRoutes.js";
import employeeRoutes from "../MediaChannel/routes/employeeRoutes.js";
import seatRoutes from "../MediaChannel/routes/seatRoutes.js";
import electionSeatRoutes from "../MediaChannel/routes/electionSeatRoutes.js";

const router = express.Router();

router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/elections", electionRoutes);
router.use("/api/v1/tags", tagRoutes);
router.use("/api/v1/parties", partyRoutes);
router.use("/api/v1/employees", employeeRoutes);
router.use("/api/v1/seats", seatRoutes);
router.use("/api/v1/electionseats", electionSeatRoutes);

export default router;
