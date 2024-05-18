// models/mediaChannel.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const mediaChannelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mediaChannelProfile: {
    description: { type: String },
    logoUrl: { type: String },
    websiteUrl: { type: String },
    socialMedia: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
    },
  },
  billing: {
    plan: { type: String },
    status: { type: String },
    nextBillingDate: { type: Date },
    paymentMethod: {
      type: { type: String },
      details: { type: String },
    },
  },
});

mediaChannelSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

mediaChannelSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const MediaChannel = mongoose.model("MediaChannel", mediaChannelSchema);

export default MediaChannel;
