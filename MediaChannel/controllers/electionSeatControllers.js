import Election from "../../models/electionModel.js";
import Seat from "../../models/seatsModel.js";
import ElectionSeat from "../../models/ElectionSeatModel.js";
import Party from "../../models/partyModel.js";
import Employee from "../../models/employeeModel.js";

// import { electionStatus } from "../../Utils/HelperData.js";

// Add an ElectionSeat
export const addElectionSeat = async (req, res) => {
  try {
    const { seat, election } = req.body;

    // Check if the election seat already exists
    const existingElectionSeat = await ElectionSeat.findOne({
      seat,
      election,
    }).exec();
    if (existingElectionSeat) {
      return res.status(400).json({
        success: false,
        error: "Election seat already exists",
      });
    }

    // If it doesn't exist, create and save the new election seat
    const newElectionSeat = new ElectionSeat({
      seat,
      election,
    });

    const savedElectionSeat = await newElectionSeat.save();

    res.status(201).json({
      success: true,
      data: savedElectionSeat,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// delete an ElectionSeat
export const removeElectionSeat = async (req, res) => {
  try {
    const electionSeatId = req.params.id;

    const electionSeat = await ElectionSeat.findOneAndDelete({
      _id: electionSeatId,
    });

    if (!electionSeat) {
      return res.status(404).json({ error: "ElectionSeat not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        electionSeat,
        message: "ElectionSeat deleted successfully",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add a party to an ElectionSeat
export const addPartyToElectionSeat = async (req, res) => {
  try {
    const electionSeatId = req.params.id;
    const { party, candidate = {} } = req.body;

    // Check if the party already exists in the parties array
    const existingElectionSeat = await ElectionSeat.findById(electionSeatId);
    const existingParty = existingElectionSeat.parties.find(
      (p) => p.party.toString() === party.toString()
    );

    if (existingParty) {
      return res.status(400).json({ success: false, error: "Party exists" });
    }

    const updatedElectionSeat = await ElectionSeat.findByIdAndUpdate(
      electionSeatId,
      {
        $push: {
          parties: { party, candidate },
        },
      },
      { new: true }
    );

    if (!updatedElectionSeat) {
      return res
        .status(404)
        .json({ success: false, error: "ElectionSeat not found" });
    }

    res.status(200).json(updatedElectionSeat);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// Remove a party from an ElectionSeat
export const removePartyFromElectionSeat = async (req, res) => {
  try {
    const electionSeatId = req.params.id;
    const partyId = req.params.partyId;

    const updatedElectionSeat = await ElectionSeat.findByIdAndUpdate(
      electionSeatId,
      {
        $pull: {
          parties: { party: partyId },
        },
      },
      { new: true }
    );

    if (!updatedElectionSeat) {
      return res.status(404).json({ error: "ElectionSeat not found" });
    }

    res.status(200).json(updatedElectionSeat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAvailableSeatsByElectionId = async (req, res) => {
  try {
    const electionId = req.params.id;
    const { seatType, state } = req.query;

    // Find the election by ID
    const election = await Election.findById(electionId).exec();

    if (!election) {
      return res.status(404).json({
        success: false,
        error: "Election not found",
      });
    }

    // Find all election seats for the given election ID
    const electionSeats = await ElectionSeat.find({
      election: electionId,
    }).exec();

    // Get all seats matching the seatType and state filters
    const allSeats = await Seat.find({ seatType, state })
      .select("name state status seatType reservedCategory _id")
      .lean(); // Use lean() to get plain JavaScript objects

    const availableSeats = allSeats.map((seat) => {
      const electionSeat = electionSeats.find((electionSeat) =>
        electionSeat.seat.equals(seat._id)
      );

      const alreadySelected = !!electionSeat;
      const electionSeatId = electionSeat ? electionSeat._id : null;

      return { ...seat, alreadySelected, electionSeatId };
    });

    res.status(200).json({ success: true, data: availableSeats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getIncludedSeatsByElectionId = async (req, res) => {
  try {
    const electionId = req.params.id;
    const { seatType, state } = req.query;

    // Find all election seats for the given election ID
    const electionSeats = await ElectionSeat.find({ election: electionId })
      .populate({
        path: "seat",
        select: "name state status seatType reservedCategory _id",
      })
      .exec();

    // console.log(electionSeats);

    // Filter included seats based on seatType and state
    const includedSeats = electionSeats
      .filter((seat) => {
        const filteredSeat = seat.seat;
        return (
          (state === "All States" || filteredSeat.state === state) &&
          filteredSeat.seatType === seatType
        );
      })
      .map((seat) => ({
        ...seat.seat._doc,
        partyCount: seat.parties.length,
        employeeCount: seat.employees.length,
        seatElectionStatus: seat.status,
        electionSeatId: seat._id,
        electionId: seat.election,
      }));

    res.status(200).json({ success: true, data: includedSeats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// export const getAvailableParties = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the election seat by ID
//     const electionSeat = await ElectionSeat.findById(id).exec();

//     if (!electionSeat) {
//       return res.status(404).json({
//         success: false,
//         error: "Election seat not found",
//       });
//     }

//     // Get all parties from the Party schema
//     const allParties = await Party.find().exec();

//     // Create a map of party IDs that are associated with the election seat
//     const partiesMap = new Map();
//     electionSeat.parties.forEach((partyInfo) => {
//       partiesMap.set(partyInfo.party.toString(), true);
//     });

//     // Map all parties, indicating whether each party is already associated with the election seat
//     const availableParties = allParties.map((party) => ({
//       ...party._doc,
//       alreadyAdded: partiesMap.has(party._id.toString()),
//     }));

//     // Sort availableParties so that alreadyAdded true is on top
//     availableParties.sort((a, b) =>
//       a.alreadyAdded === b.alreadyAdded ? 0 : a.alreadyAdded ? -1 : 1
//     );

//     res.status(200).json({ success: true, data: availableParties });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

export const getAvailableParties = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the election seat by ID and select only the parties field
    const electionSeat = await ElectionSeat.findById(id, "parties").exec();

    if (!electionSeat) {
      return res.status(404).json({
        success: false,
        error: "Election seat not found",
      });
    }

    // Get all parties from the Party schema
    const allParties = await Party.find().exec();

    // Create a set of party IDs that are associated with the election seat
    const partiesSet = new Set(
      electionSeat.parties.map((partyInfo) => partyInfo.party.toString())
    );

    // Map all parties, indicating whether each party is already associated with the election seat
    const availableParties = allParties.map((party) => ({
      ...party._doc,
      alreadyAdded: partiesSet.has(party._id.toString()),
    }));

    // Sort availableParties so that alreadyAdded true is on top
    availableParties.sort((a, b) =>
      a.alreadyAdded === b.alreadyAdded ? 0 : a.alreadyAdded ? -1 : 1
    );

    res.status(200).json({ success: true, data: availableParties });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add an employee to an ElectionSeat
export const addEmployeeToElectionSeat = async (req, res) => {
  try {
    const electionSeatId = req.params.id;
    const employeeId = req.params.employeeId;

    // Check if the employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }

    // Add the employee to the ElectionSeat
    const updatedElectionSeat = await ElectionSeat.findByIdAndUpdate(
      electionSeatId,
      { $addToSet: { employees: employeeId } },
      { new: true }
    );

    if (!updatedElectionSeat) {
      return res
        .status(404)
        .json({ success: false, error: "ElectionSeat not found" });
    }

    res.status(200).json({ success: true, data: updatedElectionSeat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remove an employee from an ElectionSeat
export const removeEmployeeFromElectionSeat = async (req, res) => {
  try {
    const electionSeatId = req.params.id;
    const employeeId = req.params.employeeId;

    const updatedElectionSeat = await ElectionSeat.findByIdAndUpdate(
      electionSeatId,
      { $pull: { employees: employeeId } },
      { new: true }
    );

    if (!updatedElectionSeat) {
      return res
        .status(404)
        .json({ success: false, error: "ElectionSeat not found" });
    }

    res.status(200).json({ success: true, data: updatedElectionSeat });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// export const availableEmployees = async (req, res) => {
//   const { id: electionSeatId } = req.params;

//   const id = req.body.id;
//   const mediaChannelId = id;

//   try {
//     // Find the election seat by ID
//     const electionSeat = await ElectionSeat.findById(electionSeatId);

//     if (!electionSeat) {
//       return res.status(404).json({ message: "Election seat not found" });
//     }

//     // Fetch active Collector employees for the specified media channel
//     const employees = await Employee.find({
//       status: "Active",
//       role: "Collector",
//       mediaChannel: mediaChannelId,
//     }).select("-password -mediaChannel -__v");

//     // Fetch election seat counts for all employees
//     const employeeCounts = await ElectionSeat.aggregate([
//       {
//         $match: {
//           employees: { $in: employees.map((emp) => emp._id) },
//         },
//       },
//       {
//         $group: {
//           _id: "$employees",
//           statusCounts: {
//             $push: "$status",
//           },
//         },
//       },
//     ]);

//     console.log(employeeCounts);

//     // Create a map to store status counts for each employee
//     const statusCountsMap = new Map();
//     employeeCounts.forEach((count) => {
//       const employeeId = count._id;
//       const statusCounts = count.statusCounts.reduce((acc, status) => {
//         acc[status] = (acc[status] || 0) + 1;
//         return acc;
//       }, {});
//       statusCountsMap.set(employeeId.toString(), statusCounts);
//     });

//     console.log(statusCountsMap);
//     // Create a function to check if an employee is already added for the current election seat
//     const isEmployeeAdded = (employeeId) => {
//       return electionSeat.employees.some((emp) => emp.equals(employeeId));
//     };

//     // Loop through employees and modify each object
//     const modifiedEmployees = employees.map((employee) => {
//       const employeeIdString = employee._id.toString();
//       const alreadyAdded = isEmployeeAdded(employee._id);
//       const electionStats = statusCountsMap.get(employeeIdString) || {
//         pending: 0,
//         upcoming: 0,
//         ongoing: 0,
//         completed: 0,
//       };
//       return {
//         ...employee.toObject(),
//         alreadyAdded,
//         electionStats,
//       };
//     });

//     // Send the modified list of employees as response
//     res.status(200).json({ success: true, data: modifiedEmployees });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const availableEmployees = async (req, res) => {
  const { id: electionSeatId } = req.params;
  const id = req.body.id;
  const mediaChannelId = id;

  try {
    // Find the election seat by ID
    const electionSeat = await ElectionSeat.findById(electionSeatId);

    if (!electionSeat) {
      return res.status(404).json({ message: "Election seat not found" });
    }

    // Fetch active Collector employees for the specified media channel
    const employees = await Employee.find({
      status: "Active",
      role: "Collector",
      mediaChannel: mediaChannelId,
    }).select("-password -mediaChannel -__v");

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
    // console.log(employeeCounts);

    // Create a map to store status counts for each employee
    const statusCountsMap = new Map();
    employeeCounts.forEach((count) => {
      const { employee, status } = count._id;
      const employeeId = employee.toString();
      const statusCounts = statusCountsMap.get(employeeId) || {};
      statusCounts[status] = count.count;
      statusCountsMap.set(employeeId, statusCounts);
    });

    // Create a function to check if an employee is already added for the current election seat
    const isEmployeeAdded = (employeeId) => {
      return electionSeat.employees.some((emp) => emp.equals(employeeId));
    };

    // console.log(statusCountsMap);

    // Loop through employees and modify each object
    const modifiedEmployees = employees.map((employee) => {
      const employeeIdString = employee._id.toString();
      const alreadyAdded = isEmployeeAdded(employee._id);
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
        alreadyAdded,
        electionStats: finalelectionStats,
      };
    });

    modifiedEmployees.sort((a, b) =>
      a.alreadyAdded === b.alreadyAdded ? 0 : a.alreadyAdded ? -1 : 1
    );

    // Send the modified list of employees as response
    res.status(200).json({ success: true, data: modifiedEmployees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
