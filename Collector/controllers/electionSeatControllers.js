import ElectionSeat from "../../models/ElectionSeatModel.js";
import Vote from "../../models/voteModel.js";

export const getElectionSeats = async (req, res) => {
  try {
    console.log(req.body);
    // const { employeeId, status } = req.params;
    const { id } = req.body;
    const { page = 1, limit = 1, status } = req.query;
    const employeeId = id;

    const query = {
      employees: employeeId,
      status,
    };

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      populate: [
        { path: "seat", select: "name state seatType reservedCategory" },
        { path: "election", select: "name startDate endDate status" },
        { path: "parties.party", select: "name" },
        {
          path: "employees",
          select: "name",
        },
      ],
    };

    const electionSeats = await ElectionSeat.paginate(query, options);

    res.status(200).json(electionSeats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getElectionSeatInfoById = async (req, res) => {
  try {
    const { id } = req.params;

    const electionSeat = await ElectionSeat.findById(id)
      .populate([
        { path: "parties.party" },
        {
          path: "employees",
          select: "name email profileImage mobileNumber",
        },
        {
          path: "seat",
        },
      ])
      .select("-seat -election -status -createdAt -updatedAt -__v");

    if (!electionSeat) {
      return res.status(404).json({
        success: false,
        message: "Election seat not found",
      });
    }

    res.status(200).json({
      success: true,
      data: electionSeat,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getElectionSeatStatsById = async (req, res) => {
  try {
    const { id } = req.params;
    const collectorId = req.body.id;

    // Get the total count of votes for the election seat
    const totalVotesForSeat = await Vote.countDocuments({ electionSeat: id });

    // Get the count of votes for the election seat by the specific collector
    const votesForSeatByCollector = await Vote.countDocuments({
      electionSeat: id,
      collector: collectorId,
    });

    // Get the count of votes by vote type for the election seat

    // const voteTypeCounts = await Vote.aggregate([
    //   { $match: { electionSeat: id } },
    //   { $group: { _id: "$voteType", count: { $sum: 1 } } },
    // ]);

    // console.log("--------", voteTypeCounts);

    // const voteTypeCountsByCollector = await Vote.aggregate([
    //   { $match: { electionSeat: id, collector: collectorId } },
    //   { $group: { _id: "$voteType", count: { $sum: 1 } } },
    // ]);
    // const voteTypeCountsByCollector = await Vote.aggregate([
    //   { $match: { electionSeat: id, collector: collectorId } },
    //   {
    //     $group: {
    //       _id: {
    //         voteType: "$voteType",
    //       },
    //       count: { $sum: 1 },
    //     },
    //   },
    // ]);

    // console.log("-----------", voteTypeCountsByCollector);

    // Get the election seat data with parties and employees
    const electionSeat = await ElectionSeat.findById(id)
      .populate([{ path: "parties.party" }, { path: "employees" }])
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalVotesForSeat,
        votesForSeatByCollector,
        // voteTypeCounts,
        // voteTypeCountsByCollector,
        employeeCount: electionSeat.employees.length,
        partyCount: electionSeat.parties.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
