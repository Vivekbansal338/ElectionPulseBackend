// authControllers.js

import MediaChannel from "../../models/mediaChannelModel.js";
import jwt from "jsonwebtoken";

// mediachannel singup controller
export const MediaChannelSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log(req.body);
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

// mediachannel login controller
export const MediaChannelLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }
    const mediaChannel = await MediaChannel.findOne({ email });
    if (!mediaChannel) {
      return res.status(404).json({
        success: false,
        error: "Media channel not found",
      });
    }
    const isMatch = await mediaChannel.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Invalid email or password",
      });
    }
    // Create a JWT token
    const user = { id: mediaChannel._id };
    const token = jwt.sign(user, process.env.JWT_SECRET);
    res.status(200).json({ success: true, data: { token } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
