import express from "express";
import User from "../models/User.js";
import EligibleVoter from "../models/EligibleVoter.js";
import GroupMember from "../models/GroupMember.js";
import Vote from "../models/Vote.js";

const router = express.Router();

//get user route
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["user_id", "name", "email", "googleId"],
    });
    return res.json(users);
  } catch (err) {
    return res.status(500).json("Error: " + err);
  }
});

// Get all admin users
router.get("/admins", async (req, res) => {
  try {
    const admins = await User.findAll({
      where: { is_admin: true },
      attributes: ["user_id", "name", "email"],
    });
    return res.json(admins);
  } catch (err) {
    return res.status(500).json("Error: " + err);
  }
});

// Get all non-admin users
router.get("/non_admins", async (req, res) => {
  try {
    const nonAdmins = await User.findAll({
      where: { is_admin: false },
      attributes: ["user_id", "name", "email"],
    });
    return res.json(nonAdmins);
  } catch (err) {
    return res.status(500).json("Error: " + err);
  }
});

// Update a user's admin status
router.put("/set_admin/:id", async (req, res) => {
  const user_id = req.params.id;
  const { is_admin } = req.body;

  try {
    await User.update({ is_admin }, { where: { user_id } });
    return res.json("User admin status updated");
  } catch (err) {
    return res.status(500).json("Error: " + err);
  }
});

// Delete a user and related data
router.delete("/delete/:id", async (req, res) => {
  const user_id = req.params.id;

  try {
    // Delete related records in EligibleVoter
    await EligibleVoter.destroy({ where: { student_id: user_id } });

    // Delete related records in GroupMember
    await GroupMember.destroy({ where: { member_id: user_id } });

    // Delete related records in Vote
    await Vote.destroy({ where: { voter_id: user_id } });

    // Delete the user
    await User.destroy({ where: { user_id } });

    return res.json({ message: "User and related data deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Error: " + err });
  }
});
export default router;
