import Seat from "../../models/seatsModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

export const loadSeatsFromFile = async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filePath = join(__dirname, "../../Utils/LokSabhaSeatsCorrect.json");
    const data = fs.readFileSync(filePath, "utf8");
    const seats = JSON.parse(data);
    for (let seat of seats) {
      const newSeat = new Seat(seat);
      await newSeat.save();
    }
    res.status(201).json({
      success: true,
      data: seats,
    });
  } catch (error) {
    res.status(409).json({ success: false, message: error.message });
  }
};
