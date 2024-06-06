import Seat from "../../models/seatsModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { getCoordinates } from "../../Utils/GeospaitalData/Code.js";

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

export const loadCoordinatesFromFile = async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const name = req.params.name;
  const { coordinates, type } = getCoordinates(
    path.join(__dirname, "../../Utils/GeospaitalData/Loksabha"),
    name
  );
  if (!coordinates) {
    return res
      .status(404)
      .json({ success: false, message: "Seat not found in file" });
  }
  try {
    const seat = await Seat.findOne({ name: name });
    if (!seat) {
      return res
        .status(404)
        .json({ success: false, message: "Seat not found in database" });
    }
    console.log(
      `name of seat: ${seat.name} state of seat: ${seat.state} type of seat: ${type}`
    );
    if (type === "Polygon") {
      seat.boundary = {
        type: type,
        coordinates: coordinates,
      };
    }
    if (type === "MultiPolygon") {
      seat.boundary = {
        type: type,
        coordinates: coordinates,
      };
    }
    await seat.save();
    res.status(200).json({ success: true, data: seat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loadCoordinatesFromFileForAllSeats = async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  try {
    console.log("Loading coordinates for all seats");
    const seats = await Seat.find();
    console.log(`Total seats: ${seats.length}`);
    for (let seat of seats) {
      console.log(
        `no of seats done: ${seats.indexOf(seat) + 1} of ${
          seats.length
        } name of seat: ${seat.name} state of seat: ${seat.state}`
      );
      const name = seat.name;
      const { coordinates, type } = getCoordinates(
        path.join(__dirname, "../../Utils/GeospaitalData/Loksabha"),
        name
      );
      if (!coordinates) {
        console.log(`Coordinates not found for seat: ${name}`);
        continue;
      }

      if (type === "Polygon") {
        seat.boundary = {
          type: type,
          coordinates: coordinates,
        };
      }
      if (type === "MultiPolygon") {
        seat.boundary = {
          type: type,
          coordinates: coordinates,
        };
      }
      await seat.save();
    }
    res
      .status(200)
      .json({ success: true, message: "Coordinates loaded for all seats" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
