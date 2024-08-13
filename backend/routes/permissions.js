import express from "express";
import Vote from "../models/Vote.js";
import EligibleVoter from "../models/EligibleVoter.js";
import User from "../models/User.js";

const router = express.Router();

//Fetch students eligible to vote
router.get("/:id", async (req, res) => {
  const electionId = req.params.id;

  try {
    const eligibleVoters = await EligibleVoter.findAll({
      where: { election_id: electionId },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const students = eligibleVoters.map((voter) => ({
      student_id: voter.student_id,
      name: voter.User.name,
    }));

    res.json(students);
  } catch (error) {
    console.error("Error fetching permissions data", error);
    res.status(500).send("Server Error");
  }
});

// Remove Access
router.delete("/:electionId/:studentId", async (req, res) => {
  const { electionId, studentId } = req.params;

  try {
    const result = await EligibleVoter.destroy({
      where: { election_id: electionId, student_id: studentId },
    });

    if (result > 0) {
      res.status(200).send("Access removed successfully");
    } else {
      res.status(404).send("Eligible voter not found");
    }
  } catch (error) {
    console.error("Error removing access", error);
    res.status(500).send("Server Error");
  }
});

//Add Access
router.post("/:id", async (req, res) => {
  const electionId = req.params.id;
  const studentId = req.body.student_id;

  try {
    const result = await EligibleVoter.create({
      election_id: electionId,
      student_id: studentId,
    });

    if (result) {
      res.status(201).send("Access granted successfully");
    } else {
      res.status(409).send("Eligible voter already exists");
    }
  } catch (error) {
    console.error("Error updating access", error);
    res.status(500).send("Server Error");
  }
});

// Check Access
router.get("/check/:electionId/:studentId", async (req, res) => {
  const { electionId, studentId } = req.params;

  try {
    const eligible = await EligibleVoter.findOne({
      where: { election_id: electionId, student_id: studentId },
    });

    if (!eligible) {
      return res.status(200).json({
        eligible: false,
        voted: false,
      });
    }

    const voted = await Vote.findOne({
      where: { election_id: electionId, voter_id: studentId },
    });

    if (voted) {
      return res.status(200).json({
        eligible: true,
        voted: true,
      });
    }

    return res.status(200).json({
      eligible: true,
      voted: false,
    });
  } catch (error) {
    console.error("Error checking access", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
