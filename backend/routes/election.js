import express from "express";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import Position from "../models/Position.js";
import EligibleVoter from "../models/EligibleVoter.js";

const router = express.Router();

// Get all elections
router.get("/", async (req, res) => {
  try {
    const elections = await Election.findAll();
    res.json(elections);
  } catch (err) {
    res.status(500).json("Error: " + err);
  }
});

// Get a specific election
router.get("/:id", async (req, res) => {
  try {
    const election = await Election.findByPk(req.params.id);
    if (election) {
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
    const elections = await Election.findAll({
      include: {
        model: EligibleVoter,
        where: { student_id: req.params.id },
        attributes: [],
      },
    });
    res.json(elections);
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

// Delete an election
router.delete("/:electionId", async (req, res) => {
  try {
    const { electionId } = req.params;
    const election = await Election.findByPk(electionId);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }

    await election.destroy();

    res.json({ message: "Election deleted" });
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
