import mongoose from "mongoose";
import {
  seatStatus,
  seatReservedCategory,
  seatReservedGender,
  seatType,
  states,
} from "../Utils/HelperData.js";

const seatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, required: true, enum: states },
  status: { type: String, enum: seatStatus, default: seatStatus[0] },
  seatType: { type: String, required: true, enum: seatType },
  reservedCategory: {
    type: String,
    enum: seatReservedCategory,
    default: seatReservedCategory[0],
  },
  reservedGender: {
    type: String,
    enum: seatReservedGender,
    default: seatReservedGender[0],
  },
  totalPopulation: { type: Number },
  populationByGender: {
    male: { type: Number, default: 0 },
    female: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  populationByReligion: {
    hindu: { type: Number, default: 0 },
    muslim: { type: Number, default: 0 },
    christian: { type: Number, default: 0 },
    sikh: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  populationByCategory: {
    general: { type: Number, default: 0 },
    sc: { type: Number, default: 0 },
    st: { type: Number, default: 0 },
    obc: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  populationByCaste: [
    {
      caste: { type: String, default: "Other" },
      population: { type: Number, default: 0 },
    },
  ],
  location: {
    type: {
      type: String,
      enum: ["Point"],
      // required: true,
    },
    coordinates: {
      type: [Number],
      // required: true,
    },
  },
  boundary: {
    type: {
      type: String,
      enum: ["Polygon", "MultiPolygon"],
      // required: true
    },
    coordinates: {
      type: [[[Number]]],
      // required: true
    },
  },
});

seatSchema.index({ location: "2dsphere" });
seatSchema.index({ boundary: "2dsphere" });

const Seat = mongoose.model("Seat", seatSchema);
export default Seat;
