// authControllers.js
import Employee from '../../models/employeeModel.js';
import jwt from 'jsonwebtoken';


// employee login controller
export const AnalystLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "Email,password,role are required",
      });
    }

    const employee = await Employee.findOne({ email: email, role: role});
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
    const token = jwt.sign(user, process.env.JWT_SECRET);
    res.status(200).json({ success: true, data: {token} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


