import express from "express";
import User from "../models/User.js";

const router = express.Router();

//get user route
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["user_id", "name", "email"],
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
export default router;
