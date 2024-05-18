import Vote from "../../models/voteModel.js";
import Party from "../../models/partyModel.js";

export const createVote = async (req, res) => {
  try {
    const {
      collector,
      electionSeat,
      location,
      party,
      voteType,
      voterData,
      achievements,
      issues,
    } = req.body;

    if (voteType === "Quick") {
      const newVote = new Vote({
        collector,
        electionSeat,
        location,
        party,
        voteType,
      });

      const savedVote = await newVote.save();
      res
        .status(201)
        .json({ success: true, message: "Vote created successfully" });
    } else if (voteType === "Bulk") {
      if (Array.isArray(party)) {
        const bulkVotes = [];

        for (const { id, count } of party) {
          for (let i = 0; i < count; i++) {
            const newVote = new Vote({
              collector,
              electionSeat,
              location,
              party: id,
              voteType,
            });

            bulkVotes.push(newVote);
          }
        }

        const savedVotes = await Vote.insertMany(bulkVotes);
        res
          .status(201)
          .json({ success: true, message: "Bulk votes created successfully" });
      } else {
        res
          .status(400)
          .json({ error: "Invalid party data for Quick-Bulk vote type" });
      }
    } else if (voteType === "Detailed") {
      const newVote = new Vote({
        collector,
        electionSeat,
        location,
        party,
        voteType,
        voterData,
        achievements,
        issues,
      });

      if (newVote.voterData.age == null) {
        newVote.voterData.age = 18;
      }

      const savedVote = await newVote.save();
      res
        .status(201)
        .json({ success: true, message: "Detailed vote created successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid vote type" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating vote" });
  }
};
