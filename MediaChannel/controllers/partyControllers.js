// partyController.js
import Party from "../../models/partyModel.js";

export const getParties = async (req, res) => {
  try {
    const parties = await Party.find();
    res.status(200).json({
      success: true,
      data: parties,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
