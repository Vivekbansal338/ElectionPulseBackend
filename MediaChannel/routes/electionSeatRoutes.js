import express from "express";
import {
  addElectionSeat,
  removeElectionSeat,
  addPartyToElectionSeat,
  removePartyFromElectionSeat,
  getAvailableSeatsByElectionId,
  getIncludedSeatsByElectionId,
  getAvailableParties,
  availableEmployees,
  addEmployeeToElectionSeat,
  removeEmployeeFromElectionSeat,
} from "../controllers/electionSeatControllers.js";

import { verifyWithId } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add an ElectionSeat
router.post("/", addElectionSeat);

// Remove an ElectionSeat
router.delete("/:id", removeElectionSeat);

// Add a party to an ElectionSeat
router.put("/addparty/:id", addPartyToElectionSeat);

// Remove a party from an ElectionSeat
router.put("/removeparty/:id/:partyId", removePartyFromElectionSeat);

router.get("/availableseats/:id", verifyWithId, getAvailableSeatsByElectionId);

// get included seats by election id
router.get("/includedseats/:id", verifyWithId, getIncludedSeatsByElectionId);

// get available parties
router.get("/availableparties/:id", verifyWithId, getAvailableParties);

// get available employees
router.get("/availableemployees/:id", verifyWithId, availableEmployees);

router.post("/addemployee/:id/:employeeId", addEmployeeToElectionSeat);

// Remove employee from ElectionSeat route
router.delete(
  "/removeemployee/:id/:employeeId",
  removeEmployeeFromElectionSeat
);

export default router;
