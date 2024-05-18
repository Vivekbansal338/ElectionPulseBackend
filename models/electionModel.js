import mongoose from "mongoose";
import { electionStatus } from "../Utils/HelperData.js";
const { Schema } = mongoose;

const electionSchema = new Schema({
  name: { type: String, required: true },
  mediaChannel: {
    type: Schema.Types.ObjectId,
    ref: "MediaChannel",
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
  status: { type: String, enum: electionStatus, default: electionStatus[0] },
});

const Election = mongoose.model("Election", electionSchema);
export default Election;
