import mongoose from "mongoose";
import {
  seatElectionStatus,
  gender,
  religion,
  category,
} from "../Utils/HelperData.js";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema } = mongoose;

const electionSeatSchema = new Schema({
  seat: {
    type: Schema.Types.ObjectId,
    ref: "Seat",
    required: true,
  },
  election: {
    type: Schema.Types.ObjectId,
    ref: "Election",
    required: true,
  },
  status: {
    type: String,
    enum: seatElectionStatus,
    default: seatElectionStatus[0],
  },
  parties: [
    {
      party: {
        type: Schema.Types.ObjectId,
        ref: "Party",
        required: true,
      },
      candidate: {
        name: {
          type: String,
          default: "Unknown",
        },
        gender: {
          type: String,
          enum: gender,
          default: gender[0],
        },
        religion: {
          type: String,
          enum: religion,
          default: religion[0],
        },
        category: {
          type: String,
          enum: category,
          default: category[0],
        },
        caste: {
          type: String,
          default: "Unknown",
        },
      },
    },
  ],
  employees: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
electionSeatSchema.plugin(mongoosePaginate);

const ElectionSeat = mongoose.model("ElectionSeat", electionSeatSchema);

export default ElectionSeat;
