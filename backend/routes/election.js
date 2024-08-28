import express from "express";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import Position from "../models/Position.js";
import EligibleVoter from "../models/EligibleVoter.js";
import EligibleGroup from "../models/EligibleGroup.js";
import GroupMember from "../models/GroupMember.js";
import Votes from "../models/Vote.js";

const router = express.Router();

// Get all elections
router.get("/", async (req, res) => {
  try {
    const elections = await Election.findAll();

    // Update the accepting_responses field based on current date
    const electionsWithUpdatedStatus = await Promise.all(
      elections.map(async (election) => {
        await election.isCurrentlyAcceptingResponses(); // This will update the field if necessary
        return election;
      })
    );

    res.json(electionsWithUpdatedStatus);
  } catch (err) {
    res.status(500).json("Error: " + err);
  }
});

// Get a specific election
router.get("/:id", async (req, res) => {
  try {
    const election = await Election.findByPk(req.params.id);
    if (election) {
      await election.isCurrentlyAcceptingResponses();
      res.json(election);
    } else {
      res.status(404).json("Election not found");
    }
  } catch (err) {
    res.status(500).json("Error: " + err);
  }
});

// Get elections for a specific user
router.get("/user/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    // Step 1: Get elections where the user is directly an eligible voter
    const electionsDirect = await Election.findAll({
      include: {
        model: EligibleVoter,
        where: { student_id: studentId },
        attributes: [],
      },
    });

    // Step 2: Get groups where the user is a member
    const groupMemberships = await GroupMember.findAll({
      where: { member_id: studentId },
      attributes: ["group_id"],
    });

    if (groupMemberships.length > 0) {
      const groupIds = groupMemberships.map((gm) => gm.group_id);

      // Step 3: Get elections where the user's group is eligible
      const electionsGroup = await Election.findAll({
        include: {
          model: EligibleGroup,
          where: { group_id: groupIds },
          attributes: [],
        },
      });

      // Combine elections from both sources
      const allElections = [...electionsDirect, ...electionsGroup];

      // Remove duplicates by election ID (assuming each election has a unique 'id' property)
      const uniqueElections = allElections.filter(
        (v, i, a) => a.findIndex((t) => t.election_id === v.election_id) === i
      );

      // Update the accepting_responses field for each election
      const updatedElections = await Promise.all(
        uniqueElections.map(async (election) => {
          await election.isCurrentlyAcceptingResponses(); // This will update the field if necessary
          return election;
        })
      );

      res.json(updatedElections);
    } else {
      // If no group memberships, return only direct elections
      res.json(electionsDirect);
    }
  } catch (err) {
    res.status(500).json("Error: " + err);
  }
});

// Add a new election
router.post("/", async (req, res) => {
  try {
    const election = await Election.create({ title: "untitled election" });
    res.status(201).json(election);
  } catch (err) {
    res.status(500).json("Error: " + err);
  }
});

// Update election title
router.put("/", async (req, res) => {
  const { election_id, title } = req.body;
  try {
    const [updated] = await Election.update(
      { title },
      { where: { election_id } }
    );
    if (updated) {
      res.json("Election Title Updated");
    } else {
      res.status(404).json("Election not found");
    }
  } catch (err) {
    res.status(500).json("Error: " + err);
  }
});

// Update position information
router.put("/positions", async (req, res) => {
  const { position_id, title } = req.body;
  try {
    const [updated] = await Position.update(
      { title },
      { where: { position_id } }
    );
    if (updated) {
      res.json("Position Information Updated");
    } else {
      res.status(404).json("Position not found");
    }
  } catch (err) {
    res.status(500).json("Error: " + err);
  }
});

// Update candidate information
router.put("/candidates", async (req, res) => {
  const { candidate_id, name, grade, img_url } = req.body;
  try {
    const [updated] = await Candidate.update(
      { name, grade, img_url },
      { where: { candidate_id } }
    );
    if (updated) {
      res.json("Candidate Information Updated");
    } else {
      res.status(404).json("Candidate not found");
    }
  } catch (err) {
    res.status(500).json("Error: " + err);
  }
});

// Update settings for an election
router.put("/:electionId", async (req, res) => {
  try {
    const { electionId } = req.params;
    const {
      start_date,
      end_date,
      accepting_responses,
      use_startdate,
      use_enddate,
    } = req.body;

    const election = await Election.findByPk(electionId);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    election.use_enddate = use_enddate;
    election.use_startdate = use_startdate;

    //Check dates and usages
    if (use_startdate && start_date !== "") {
      election.use_startdate = use_startdate;
      election.start_date = start_date;
    }
    if (use_enddate && end_date !== "") {
      election.use_enddate = use_enddate;
      election.end_date = end_date;
    }
    if (use_startdate && start_date === "") {
      election.use_startdate = false;
    }
    if (use_enddate && end_date === "") {
      election.use_enddate = false;
    }
    election.accepting_responses = accepting_responses;

    await election.save();

    res.json({ message: "Election settings updated", election });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating election settings", error });
  }
});

// Delete an election and its associated data
router.delete("/:electionId", async (req, res) => {
  try {
    const { electionId } = req.params;
    const election = await Election.findByPk(electionId, {
      include: [
        {
          model: Position,
          include: Candidate,
        },
        {
          model: EligibleGroup,
        },
        {
          model: EligibleVoter,
        },
      ],
    });

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    await Votes.destroy({ where: { election_id: electionId } });

    // Delete associated candidates first
    for (const position of election.Positions) {
      await Candidate.destroy({ where: { position_id: position.position_id } });
      await position.destroy();
    }

    // Delete associated eligible groups
    await EligibleGroup.destroy({ where: { election_id: electionId } });

    // Delete associated eligible voters
    await EligibleVoter.destroy({ where: { election_id: electionId } });

    // Delete the election
    await election.destroy();

    res.json({ message: "Election and all associated data deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting election", error });
  }
});

// Add a new candidate
router.post("/candidates", async (req, res) => {
  const { position_id, name, grade, img_url } = req.body;
  try {
    const candidate = await Candidate.create({
      position_id,
      name,
      grade,
      img_url,
    });
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json("Error: " + err);
  }
});

// Delete a candidate
router.delete("/candidates/:id", async (req, res) => {
  try {
    const deleted = await Candidate.destroy({
      where: { candidate_id: req.params.id },
    });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json("Candidate not found");
    }
  } catch (err) {
    res.status(500).json("Error: " + err);
  }
});

// Get positions and candidates for a specific election
router.get("/positions/:election_id", async (req, res) => {
  const electionId = req.params.election_id;

  try {
    // Fetch positions and their associated candidates for the specified election
    const positions = await Position.findAll({
      where: { election_id: electionId },
      include: {
        model: Candidate,
        attributes: ["candidate_id", "name", "grade", "img_url"],
      },
    });

    // Format the response to group candidates into an array for each position
    const formattedPositions = positions.map((position) => ({
      position_id: position.position_id,
      title: position.title,
      candidates: position.Candidates.map((candidate) => ({
        candidate_id: candidate.candidate_id,
        name: candidate.name,
        grade: candidate.grade,
        img_url: candidate.img_url,
      })),
    }));

    res.json(formattedPositions);
  } catch (err) {
    res.status(500).json("Error fetching positions and candidates: " + err);
  }
});

// Add a new position
router.post("/positions", async (req, res) => {
  const { election_id, title } = req.body;

  try {
    // Create the new position using Sequelize
    const newPosition = await Position.create({
      election_id,
      title,
    });

    // Return the newly created position with an empty candidates array
    return res.status(201).json({
      position_id: newPosition.position_id,
      title: newPosition.title,
      candidates: [],
    });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({ error: "Database error: " + err });
  }
});

// Delete a position
router.delete("/positions/:id", async (req, res) => {
  try {
    const deleted = await Position.destroy({
      where: { position_id: req.params.id },
    });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json("Position not found");
    }
  } catch (err) {
    res.status(500).json("Error: " + err);
  }
});

export default router;
