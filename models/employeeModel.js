import mongoose from "mongoose";
import {
  employeeRoles,
  employeeStatus,
  employeeVerificationStatus,
  states,
} from "../Utils/HelperData.js";
import bcrypt from "bcrypt";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: employeeRoles, required: true },
  profileImage: { type: String },
  mediaChannel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MediaChannel",
    required: true,
  },
  status: { type: String, enum: employeeStatus, default: employeeStatus[0] },
  state: { type: String, default: "Unknown", enum: states },
  preferedLokSabhaSeats: { type: String, default: "Unknown" },
  preferedVidhanSabhaSeats: { type: String, default: "Unknown" },
  verificationStatus: {
    type: String,
    enum: employeeVerificationStatus,
    default: employeeVerificationStatus[0],
  },
  mobileNumber: { type: String, default: "" },
  mobileOTP: { type: String, default: "" },
  emailOTP: { type: String, default: "" },
  otpExpiry: { type: Date },
});

employeeSchema.pre("save", async function (next) {
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

employeeSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
