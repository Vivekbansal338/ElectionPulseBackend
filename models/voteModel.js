import mongoose from "mongoose";
import { voteType, gender, religion, category } from "../Utils/HelperData.js";
const { Schema } = mongoose;

const voteSchema = new Schema({
  collector: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  party: { type: Schema.Types.ObjectId, ref: "Party", required: true },
  electionSeat: {
    type: Schema.Types.ObjectId,
    ref: "ElectionSeat",
    required: true,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  timestamp: { type: Date, default: Date.now },
  voteType: { type: String, enum: voteType, required: true },
  voterData: {
    name: { type: String, required: false, default: "Unknown" },
    age: { type: Number, required: false, default: 18 },
    religion: {
      type: String,
      enum: religion,
      default: religion[0],
      required: false,
    },
    gender: { type: String, enum: gender, default: gender[0], required: false },
    category: {
      type: String,
      enum: category,
      default: category[0],
      required: false,
    },
    caste: { type: String, required: false },
  },
  achievements: [{ type: Schema.Types.ObjectId, ref: "Tag", required: false }],
  issues: [{ type: Schema.Types.ObjectId, ref: "Tag", required: false }],
});

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
