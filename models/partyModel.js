import mongoose from "mongoose";
import {partyIdeologies,partyArea,states,partyStatus} from '../Utils/HelperData.js';
const { Schema } = mongoose;

const partySchema = new Schema({
  name: { type: String, required: true, default: 'Independent' },
  symbol: { type: String, required: true },
  shortName: { type: String, required: true },
  founded: { type: Date },
  ideology: { type: String , required: true ,
    enum: partyIdeologies,
    default: partyIdeologies[0]
  },
  area : { type: String, required: true, enum: partyArea, default: partyArea[0] },
  status: { type: String, enum: partyStatus, default: partyStatus[0] },
});

const Party = mongoose.model("Party", partySchema);
export default Party;