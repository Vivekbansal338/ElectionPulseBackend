// authControllers.js
import Employee from "../../models/employeeModel.js";
import jwt from "jsonwebtoken";
// import { sendOTPToMobile, sendOTPToEmail } from "../utils/otpUtils.js";

// employee login controller
export const CollectorLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "Email,password,role are required",
      });
    }

    const employee = await Employee.findOne({ email: email, role: role });
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Account not found",
      });
    }
    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Invalid email or password",
      });
    }
    // Create a JWT token
    const user = { id: employee._id };
    const verification = employee.verificationStatus === "Pending" ? 0 : 1;
    const token = jwt.sign(user, process.env.JWT_SECRET);
    res
      .status(200)
      .json({ success: true, data: { token, verification, user } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// authControllers.js
export const sendVerifyOTP = async (req, res) => {
  try {
    const { id, mobileNumber } = req.body;
    const employeeId = id;

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Generate OTPs
    const mobileOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiry time (e.g., 10 minutes)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update the employee with the mobile number, OTPs, and expiry time
    employee.mobileNumber = mobileNumber;
    employee.mobileOTP = mobileOTP;
    employee.emailOTP = emailOTP;
    employee.otpExpiry = otpExpiry;
    await employee.save();

    // Send OTPs to mobile and email
    // await sendOTPToMobile(mobileNumber, mobileOTP);
    // await sendOTPToEmail(email, emailOTP);

    res.status(200).json({
      success: true,
      data: {
        message: "OTPs sent successfully",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending OTPs" });
  }
};

export const submitVerifyOTP = async (req, res) => {
  try {
    const { id, mobileOTP, emailOTP } = req.body;
    const employeeId = id;

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Check if OTPs match and are not expired
    const currentTime = new Date();
    const mobileOTPValid =
      mobileOTP !== "" &&
      employee.mobileOTP === mobileOTP &&
      currentTime <= employee.otpExpiry;
    const emailOTPValid =
      emailOTP !== "" &&
      employee.emailOTP === emailOTP &&
      currentTime <= employee.otpExpiry;

    if (mobileOTPValid && emailOTPValid) {
      // Update verificationStatus to "Verified"
      employee.verificationStatus = "Verified";
      employee.mobileOTP = "";
      employee.emailOTP = "";
      employee.otpExpiry = null;
      await employee.save();
      await employee.save();

      res.status(200).json({
        success: true,
        data: {
          message: "Verification successful",
        },
      });
    } else {
      // Clear mobile number, OTPs, and expiry time if verification fails
      employee.mobileNumber = "";
      employee.mobileOTP = "";
      employee.emailOTP = "";
      employee.otpExpiry = null;
      await employee.save();

      res
        .status(400)
        .json({ success: false, message: "Invalid OTPs or OTPs expired" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error verifying OTPs" });
  }
};
