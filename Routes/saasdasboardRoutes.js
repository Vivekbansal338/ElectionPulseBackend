import express from "express";
import partyRoutes from "../Saas/routes/partyRoutes.js";
import seatRoutes from "../Saas/routes/seatRoutes.js";

const router = express.Router();

router.use("/api/v1/parties", partyRoutes);
router.use("/api/v1/seats", seatRoutes);

export default router;
