import Employee from "../../models/employeeModel.js";

// employeeControllers.js
export const getEmployeeProfile = async (req, res) => {
  const { id } = req.body;

  try {
    const employee = await Employee.findById(id).select(
      "-__v -password -mediaChannel -emailOTP -mobileOTP -otpExpiry"
    );

    if (!employee) {
      res.status(404).json({ success: false, message: "Employee not found" });
    } else {
      res.status(200).json({ success: true, data: employee });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
