import Election from "../../models/electionModel.js";
import ElectionSeat from "../../models/ElectionSeatModel.js";
import MediaChannel from "../../models/mediaChannelModel.js";
import bcrypt from "bcryptjs";

export const createElection = async (req, res) => {
  const { name, id, startDate, endDate, description } = req.body;
  const mediaChannel = id;
  try {
    const election = new Election({
      name,
      mediaChannel,
      startDate,
      endDate,
      description,
    });
    await election.save();
    res.status(201).json({ success: true, data: election });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getElections = async (req, res) => {
  try {
    const { id: mediaChannel } = req.body;
    const elections = await Election.find({ mediaChannel }).lean();

    // Fetch all election seats for the given elections
    const electionIds = elections.map((election) => election._id);
    const electionSeats = await ElectionSeat.find({
      election: { $in: electionIds },
    }).lean();

    // Calculate stats
    const totalElections = elections.length;
    const pendingElections = elections.filter(
      (e) => e.status === "Pending"
    ).length;
    const upcomingElections = elections.filter(
      (e) => e.status === "Upcoming"
    ).length;
    const ongoingElections = elections.filter(
      (e) => e.status === "Ongoing"
    ).length;
    const completedElections = elections.filter(
      (e) => e.status === "Completed"
    ).length;

    // Format elections array
    const formattedElections = elections.map((election) => {
      const electionSeatsForCurrent = electionSeats.filter((seat) =>
        seat.election.equals(election._id)
      );
      const pendingSeatsForElection = electionSeatsForCurrent.filter(
        (seat) => seat.status === "Pending"
      ).length;
      const completedSeatsForElection = electionSeatsForCurrent.filter(
        (seat) => seat.status === "Completed"
      ).length;
      const preparedSeatsForElection = electionSeatsForCurrent.filter(
        (seat) => seat.parties.length >= 2 && seat.employees.length >= 1
      ).length;

      return {
        id: election._id,
        name: election.name,
        startDate: election.startDate,
        endDate: election.endDate,
        seatsCount: electionSeatsForCurrent.length,
        pendingSeats: pendingSeatsForElection,
        completedSeats: completedSeatsForElection,
        preparedSeats: preparedSeatsForElection,
        status: election.status,
        description: election.description,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          total: totalElections,
          pending: pendingElections,
          upcoming: upcomingElections,
          ongoing: ongoingElections,
          completed: completedElections,
        },
        elections: formattedElections,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getElection = async (req, res) => {
  try {
    const { id } = req.params;
    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    res.status(200).json({ success: true, data: election });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateElection = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, name, description } = req.body;
    const updateData = { startDate, endDate, name, description };
    const election = await Election.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!election) {
      return res.status(404).json({
        success: false,
        error: "Election not found",
      });
    }
    res.status(200).json({ success: true, data: election });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getElectionStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const election = await Election.findById(id);
    if (!election) {
      throw new Error("Election not found");
    }

    res.status(200).json({
      success: true,
      data: {
        status: election.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Define the isValidTransition function
function isValidTransition(current, next) {
  // Define the valid transitions
  const validTransitions = {
    Pending: ["Upcoming"],
    Upcoming: ["Ongoing", "Pending"],
    Ongoing: ["Completed"],
    Completed: [],
  };

  // Check if the next status is valid for the current status
  return validTransitions[current] && validTransitions[current].includes(next);
}

export const changeElectionStatus = async (req, res) => {
  try {
    const { electionId, id: mediaChannelId, password, nextStatus } = req.body;

    if (!electionId || !mediaChannelId || !password || !nextStatus) {
      return res.status(400).json({
        success: false,
        error: "Invalid request. Please provide complete data.",
      });
    }

    // Fetch the media channel
    const mediaChannel = await MediaChannel.findById(mediaChannelId);
    if (!mediaChannel) {
      return res
        .status(404)
        .json({ success: false, error: "Media channel not found" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, mediaChannel.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid password" });
    }

    // Fetch the election
    const election = await Election.findById(electionId);
    if (!election) {
      return res
        .status(404)
        .json({ success: false, error: "Election not found" });
    }

    // Check if the status transition is allowed
    if (!isValidTransition(election.status, nextStatus)) {
      return res
        .status(400)
        .json({ success: false, error: "This status change not allowed" });
    }

    // Fetch all election seats related to the election
    const electionSeats = await ElectionSeat.find({ election: electionId });

    if (electionSeats.length === 0) {
      return res.status(400).json({
        success: false,
        error:
          "No election seats found for the given election. Minimum 1 required.",
      });
    }

    // Check if each election seat has at least 2 parties and 1 employee
    for (let seat of electionSeats) {
      if (seat.parties.length < 2 || seat.employees.length < 1) {
        return res.status(400).json({
          success: false,
          error:
            "Each election seat must have at least 2 parties and 1 employee",
        });
      }
    }

    // Update the status of the election and all related election seats
    election.status = nextStatus;
    await election.save();
    for (let seat of electionSeats) {
      seat.status = nextStatus;
      await seat.save();
    }

    res.json({
      success: true,
      data: { message: "Election status updated successfully" },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSeatOverviewByElection = async (req, res) => {
  try {
    const electionId = req.params.electionId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalSeats = await ElectionSeat.countDocuments({
      election: electionId,
    });

    const electionSeats = await ElectionSeat.find({ election: electionId })
      .populate("seat")
      .sort({ "seat.state": 1 })
      .skip(skip)
      .limit(limit);

    const formattedData = [];

    for (const seat of electionSeats) {
      const seatData = {
        id: seat._id,
        name: seat.seat.name,
        state: seat.seat.state,
        electionSeatStatus: seat.status,
        seatType: seat.seat.seatType,
        seatReservedCategory: seat.seat.reservedCategory,
        employeeCount: seat.employees.length,
        partyCount: seat.parties.length,
        prepared: seat.parties.length >= 2 && seat.employees.length >= 1,
      };
      formattedData.push(seatData);
    }

    const totalPages = Math.ceil(totalSeats / limit);

    res.status(200).json({
      success: true,
      count: totalSeats,
      totalPages: totalPages,
      currentPage: page,
      limit: limit,
      data: formattedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
