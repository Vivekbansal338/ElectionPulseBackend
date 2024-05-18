import Seat from "../../models/seatsModel.js";

export const getAllSeats = async (req, res) => {
  try {
    const seats = await Seat.find(
      {},
      "name state status seatType reservedCategory _id"
    );
    res.status(200).json({ success: true, data: seats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
