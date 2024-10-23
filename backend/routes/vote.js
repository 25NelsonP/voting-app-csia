import express from "express";
import Vote from "../models/Vote.js";
import EligibleVoter from "../models/EligibleVoter.js";
import Candidate from "../models/Candidate.js";
import Position from "../models/Position.js";
import EligibleGroup from "../models/EligibleGroup.js";
import GroupMember from "../models/GroupMember.js";

const router = express.Router();

//Get Voting Results
router.get("/:electionId", async (req, res) => {
  const { electionId } = req.params;

  try {
    // Fetching all votes for the given election
    const votes = await Vote.findAll({
      where: { election_id: electionId },
    });

    // Extract candidate IDs from the votes
    const voteCounts = votes.reduce((acc, vote) => {
      Object.values(vote.candidates).forEach((candidateId) => {
        acc[candidateId] = (acc[candidateId] || 0) + 1;
      });
      return acc;
    }, {});

    // Fetch all positions with candidates for the given election
    const positions = await Position.findAll({
      where: { election_id: electionId },
      include: [
        {
          model: Candidate,
        },
      ],
    });

    // Combine candidates with their vote counts and sort them by vote count
    const result = positions.map((position) => ({
      position_id: position.position_id,
      title: position.title,
      candidates: position.Candidates.map((candidate) => ({
        ...candidate.toJSON(),
        voteCount: voteCounts[candidate.candidate_id] || 0,
      })).sort((a, b) => b.voteCount - a.voteCount), // Sort candidates by voteCount in descending order
    }));

    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving vote counts", error });
  }
});

//Saving a vote
router.post("/submit", async (req, res) => {
  const { voter_id, election_id, votes } = req.body;

  try {
    // Check if the voter is eligible to vote directly
    const eligibleVoter = await EligibleVoter.findOne({
      where: { student_id: voter_id, election_id: election_id },
    });

    // Check if there are eligible groups for this election
    const eligibleGroups = await EligibleGroup.findAll({
      where: { election_id: election_id },
    });

    let groupEligible = false;

    if (eligibleGroups && eligibleGroups.length > 0) {
      // Get the group IDs that are eligible
      const eligibleGroupIds = eligibleGroups.map((group) => group.group_id);

      // Check if the student belongs to any of the eligible groups
      const groupMember = await GroupMember.findOne({
        where: {
          group_id: eligibleGroupIds,
          member_id: voter_id,
        },
      });

      if (groupMember) {
        groupEligible = true;
      }
    }

    // If neither directly eligible nor group eligible, return error response
    if (!eligibleVoter && !groupEligible) {
      return res
        .status(403)
        .json({ message: "Voter is not eligible to vote in this election." });
    }

    // Record the vote
    await Vote.create({
      election_id,
      voter_id,
      candidates: votes, // Storing the object as JSON
    });

    res.status(201).json({ message: "Votes successfully recorded!" });
  } catch (error) {
    console.error("Error recording votes:", error);
    res.status(500).json({ message: "Failed to record votes." });
  }
});

export default router;
