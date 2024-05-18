// controllers/mediaChannelController.js
import MediaChannel from "../models/mediaChannelModel.js";

// name: { type: String, required: true },
// email: { type: String, required: true, unique: true },
// password: { type: String, required: true },
// reporters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reporter" }],
// elections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Election" }],
// mediaChannelProfile: {
//   description: { type: String },
//   logoUrl: { type: String },
//   websiteUrl: { type: String },
//   socialMedia: {
//     facebook: { type: String },
//     twitter: { type: String },
//     instagram: { type: String },
//   },
// },

export const createMediaChannel = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required",
      });
    }
    const newMediaChannel = new MediaChannel({
      name,
      email,
      password,
    });
    const createdMediaChannel = await newMediaChannel.save();
    const data = {
      name: createdMediaChannel.name,
      email: createdMediaChannel.email,
    };
    res.status(201).json({ success: true, data: data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const getAllMediaChannels = async (req, res) => {
  try {
    const mediaChannels = await MediaChannel.find();
    res.status(200).json({ success: true, data: mediaChannels });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMediaChannelById = async (req, res) => {
  try {
    const mediaChannel = await MediaChannel.findById(req.params.id);
    if (!mediaChannel) {
      return res
        .status(404)
        .json({ success: false, error: "Media channel not found" });
    }
    res.status(200).json({ success: true, data: mediaChannel });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateMediaChannel = async (req, res) => {
  try {
    const mediaChannel = await MediaChannel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!mediaChannel) {
      return res
        .status(404)
        .json({ success: false, error: "Media channel not found" });
    }
    res.status(200).json({ success: true, data: mediaChannel });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

export const deleteMediaChannel = async (req, res) => {
  try {
    const mediaChannel = await MediaChannel.findByIdAndDelete(req.params.id);
    if (!mediaChannel) {
      return res
        .status(404)
        .json({ success: false, error: "Media channel not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
