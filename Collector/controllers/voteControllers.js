import Vote from "../../models/voteModel.js";
// import Party from "../../models/partyModel.js";
import Tag from "../../models/tagModel.js";
import ElectionSeat from "../../models/ElectionSeatModel.js";

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
      const electionSeatDoc = await ElectionSeat.findById(electionSeat);
      if (!electionSeatDoc) {
        return res.status(404).json({ error: "Election seat not found" });
      }

      const electionId = electionSeatDoc.election;

      const achievementTags = await Promise.all(
        achievements.map(async (achievement) => {
          const existingTag = await Tag.findOne({
            election: electionId,
            name: achievement,
          });
          if (existingTag) {
            return existingTag._id;
          } else {
            const newTag = new Tag({
              election: electionId,
              name: achievement,
            });
            const savedTag = await newTag.save();
            return savedTag._id;
          }
        })
      );

      const issueTags = await Promise.all(
        issues.map(async (issue) => {
          const existingTag = await Tag.findOne({
            election: electionId,
            name: issue,
          });
          if (existingTag) {
            return existingTag._id;
          } else {
            const newTag = new Tag({
              election: electionId,
              name: issue,
            });
            const savedTag = await newTag.save();
            return savedTag._id;
          }
        })
      );

      // unique achievement and issue tags
      const uniqueAchievementTags = [...new Set(achievementTags)];
      const uniqueIssueTags = [...new Set(issueTags)];

      const newVote = new Vote({
        collector,
        electionSeat,
        location,
        party,
        voteType,
        voterData,
        achievements: uniqueAchievementTags,
        issues: uniqueIssueTags,
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
    //   const newVote = new Vote({
    //     collector,
    //     electionSeat,
    //     location,
    //     party,
    //     voteType,
    //     voterData,
    //     achievements,
    //     issues,
    //   });

    //   if (newVote.voterData.age == null) {
    //     newVote.voterData.age = 18;
    //   }

    //   const savedVote = await newVote.save();
    //   res
    //     .status(201)
    //     .json({ success: true, message: "Detailed vote created successfully" });
    // } else {
    //   res.status(400).json({ success: false, message: "Invalid vote type" });
    // }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating vote" });
  }
};
