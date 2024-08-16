import express from "express";
import Vote from "../models/Vote.js";
import EligibleVoter from "../models/EligibleVoter.js";
import User from "../models/User.js";
import EligibleGroup from "../models/EligibleGroup.js";
import GroupMember from "../models/GroupMember.js";
import Group from "../models/Group.js";

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

// Fetch groups eligible to vote
router.get("/groups/:id", async (req, res) => {
  const electionId = req.params.id;

  try {
    const eligibleGroups = await EligibleGroup.findAll({
      where: { election_id: electionId },
      include: [
        {
          model: Group,
          attributes: ["group_name"],
        },
      ],
    });

    const groups = eligibleGroups.map((group) => ({
      group_id: group.group_id,
      group_name: group.Group.group_name,
    }));

    res.json(groups);
  } catch (error) {
    console.error("Error fetching eligible groups", error);
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

// Remove access for a group
router.delete("/groups/:electionId/:groupId", async (req, res) => {
  const { electionId, groupId } = req.params;

  try {
    const result = await EligibleGroup.destroy({
      where: { election_id: electionId, group_id: groupId },
    });

    if (result > 0) {
      res.status(200).send("Group access removed successfully");
    } else {
      res.status(404).send("Eligible group not found");
    }
  } catch (error) {
    console.error("Error removing group access", error);
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

// Add access for a group
router.post("/groups/:id", async (req, res) => {
  const electionId = req.params.id;
  const groupId = req.body.group_id;

  try {
    const result = await EligibleGroup.create({
      election_id: electionId,
      group_id: groupId,
    });

    if (result) {
      res.status(201).send("Group access granted successfully");
    } else {
      res.status(409).send("Group is already eligible");
    }
  } catch (error) {
    console.error("Error adding group access", error);
    res.status(500).send("Server Error");
  }
});

// Check Access
router.get("/check/:electionId/:studentId", async (req, res) => {
  const { electionId, studentId } = req.params;

  try {
    // Check direct eligibility in EligibleVoters table
    const eligible = await EligibleVoter.findOne({
      where: { election_id: electionId, student_id: studentId },
    });

    // Check if there are any eligible groups for this election
    const eligibleGroups = await EligibleGroup.findAll({
      where: { election_id: electionId },
    });

    // If not eligible directly and no eligible groups, return ineligible
    if (!eligible && (!eligibleGroups || eligibleGroups.length === 0)) {
      return res.status(200).json({
        eligible: false,
        voted: false,
      });
    }

    let groupEligible = false;

    if (eligibleGroups && eligibleGroups.length > 0) {
      // Get the group IDs that are eligible
      const eligibleGroupIds = eligibleGroups.map((group) => group.group_id);

      // Check if the student belongs to any of the eligible groups
      const groupMember = await GroupMember.findOne({
        where: {
          group_id: eligibleGroupIds,
          member_id: studentId,
        },
      });

      if (groupMember) {
        groupEligible = true;
      }
    }

    // If neither directly eligible nor group eligible, return ineligible
    if (!eligible && !groupEligible) {
      return res.status(200).json({
        eligible: false,
        voted: false,
      });
    }

    // Check if the student has already voted
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
