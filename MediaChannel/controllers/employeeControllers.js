import Employee from "../../models/employeeModel.js";
import ElectionSeat from "../../models/ElectionSeatModel.js";

// create employee controller
export const CreateEmployee = async (req, res) => {
  try {
    const { name, email, password, role, id, profileImage } = req.body;
    const mediaChannel = id;
    if (!name || !email || !password || !role || !mediaChannel) {
      return res.status(400).json({
        success: false,
        error: "Name, email, password, role, and media channel are required",
      });
    }
    const newEmployee = new Employee({
      name,
      email,
      password,
      role,
      mediaChannel,
      profileImage,
    });
    const createdEmployee = await newEmployee.save();

    const data = {
      name: createdEmployee.name,
      email: createdEmployee.email,
      role: createdEmployee.role,
      profileImage: createdEmployee.profileImage,
      mediaChannel: createdEmployee.mediaChannel,
    };
    res.status(201).json({ success: true, data: data });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// get employees controller
export const getEmployees = async (req, res) => {
  try {
    const { id } = req.body; // get mediaChannel id from request body
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Employee.countDocuments({ mediaChannel: id });
    const employees = await Employee.find({ mediaChannel: id })
      .select("-password -mediaChannel -__v")
      .skip(skip)
      .limit(limit);

    // Fetch election seat counts for all employees
    const employeeCounts = await ElectionSeat.aggregate([
      {
        $match: {
          employees: { $in: employees.map((emp) => emp._id) },
        },
      },
      {
        $unwind: "$employees", // Unwind employees array to treat each employee separately
      },
      {
        $group: {
          _id: { employee: "$employees", status: "$status" }, // Group by employee and status combination
          count: { $sum: 1 }, // Count occurrences of each status for each employee
        },
      },
    ]);

    // Create a map to store status counts for each employee
    const statusCountsMap = new Map();
    employeeCounts.forEach((count) => {
      const { employee, status } = count._id;
      const employeeId = employee.toString();
      const statusCounts = statusCountsMap.get(employeeId) || {};
      statusCounts[status] = count.count;
      statusCountsMap.set(employeeId, statusCounts);
    });

    const modifiedEmployees = employees.map((employee) => {
      const employeeIdString = employee._id.toString();
      const electionStats = statusCountsMap.get(employeeIdString) || {
        pending: 0,
        upcoming: 0,
        ongoing: 0,
        completed: 0,
      };
      const finalelectionStats = {
        pending: electionStats["Pending"] || 0,
        upcoming: electionStats["Upcoming"] || 0,
        ongoing: electionStats["Ongoing"] || 0,
        completed: electionStats["Completed"] || 0,
      };

      return {
        ...employee.toObject(),
        electionStats: finalelectionStats,
      };
    });

    res.status(200).json({
      success: true,
      count: employees.length,
      total,
      data: modifiedEmployees,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
