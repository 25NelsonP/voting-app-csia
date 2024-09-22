import express from "express";
import Group from "../models/Group.js";
import GroupMember from "../models/GroupMember.js";
import User from "../models/User.js";

const router = express.Router();

// Get all groups
router.get("/", async (req, res) => {
  try {
    const groups = await Group.findAll();
    return res.json(groups);
  } catch (err) {
    return res.status(500).json("Error: " + err);
  }
});

// Get specific group
router.get("/:groupId", async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findOne({ where: { group_id: groupId } });
    return res.json(group.dataValues);
  } catch (err) {
    return res.status(500).json("Error: " + err);
  }
});

// Add a new group
router.post("/", async (req, res) => {
  const { group_name } = req.body;
  try {
    const newGroup = await Group.create({ group_name });
    return res.status(201).json(newGroup);
  } catch (err) {
    return res.status(500).json("Error: " + err);
  }
});

// Update a group
router.put("/:groupId", async (req, res) => {
  const { groupId } = req.params;
  const { group_name } = req.body;
  try {
    await Group.update({ group_name }, { where: { group_id: groupId } });
    return res.json({ group_id: groupId, group_name });
  } catch (err) {
    return res.status(500).json("Error: " + err);
  }
});

// Delete a group
router.delete("/:groupId", async (req, res) => {
  const { groupId } = req.params;
  try {
    await Group.destroy({ where: { group_id: groupId } });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json("Error: " + err);
  }
});

// Get all members of a group
router.get("/:groupId/members", async (req, res) => {
  const { groupId } = req.params;

  try {
    const members = await GroupMember.findAll({
      where: { group_id: groupId },
      include: {
        model: User,
        attributes: ["user_id", "name", "email"],
      },
      attributes: ["date_added"],
    });

    // Formatting the response to match the structure you want
    const response = members.map((member) => ({
      user_id: member.User.user_id,
      name: member.User.name,
      email: member.User.email,
      date_added: member.date_added,
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json("Error fetching group members: " + err);
  }
});

// Add a user to a group
router.post("/:groupId/members", async (req, res) => {
  const { groupId } = req.params;
  const { member_id } = req.body;
  try {
    const newMember = await GroupMember.create({
      group_id: groupId,
      member_id,
      date_added: new Date(),
    });
    return res.status(201).json(newMember);
  } catch (err) {
    return res.status(500).json("Error: " + err);
  }
});

// Remove a user from a group
router.delete("/:groupId/members/:memberId", async (req, res) => {
  const { groupId, memberId } = req.params;
  try {
    await GroupMember.destroy({
      where: { group_id: groupId, member_id: memberId },
    });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json("Error: " + err);
  }
});

//add user through google/csv import
router.post("/import/:groupId", async (req, res) => {
  const { groupId } = req.params;
  const { emails } = req.body;

  // Email validation regex
  const emailRegex = /\S+@\S+\.\S+/;

  try {
    const newUsers = [];
    const validEmails = emails.filter((email) => emailRegex.test(email)); // Filter valid emails
    if (validEmails.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid email addresses provided." });
    }

    for (let email of validEmails) {
      // Check if user exists
      let user = await User.findOne({ where: { email } });

      // If user doesn't exist, create a new one
      if (!user) {
        user = await User.create({ email });
      }

      // Check if the user is already a member of the group
      const existingMember = await GroupMember.findOne({
        where: { member_id: user.user_id, group_id: groupId },
      });

      // If not a member, add the user to the group
      if (!existingMember) {
        await GroupMember.create({
          member_id: user.user_id,
          group_id: groupId,
        });
        newUsers.push(user);
      }
    }

    res.status(200).json({ newUsers });
  } catch (error) {
    console.error("Error importing users", error);
    res.status(500).json({ error: "Error importing users" });
  }
});

export default router;
