import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all groups
router.get("/", (req, res) => {
  const q = "SELECT * FROM `Groups`;";
  db.query(q, (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json(data);
  });
});

//Get specific group
router.get("/:groupId", (req, res) => {
  const q = "SELECT * FROM `Groups` WHERE group_id = ?";
  const group_id = req.params.groupId;

  db.query(q, [group_id], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json(data);
  });
});

// Add a new group
router.post("/", (req, res) => {
  const { group_name } = req.body;
  const q = "INSERT INTO `Groups` (group_name) VALUES (?)";
  db.query(q, [group_name], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.status(201).json({ group_id: data.insertId, group_name });
  });
});

// Update a group
router.put("/:groupId", (req, res) => {
  const { groupId } = req.params;
  const { group_name } = req.body;
  const q = "UPDATE `Groups` SET group_name = ? WHERE group_id = ?";
  db.query(q, [group_name, groupId], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json({ group_id: groupId, group_name });
  });
});

// Delete a group
router.delete("/:groupId", (req, res) => {
  const { groupId } = req.params;
  const q = "DELETE FROM `Groups` WHERE group_id = ?";
  db.query(q, [groupId], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.status(204).end();
  });
});

// Get all members of a group
router.get("/:groupId/members", (req, res) => {
  const { groupId } = req.params;
  const q = `SELECT Users.user_id, Users.name, Group_Members.date_added FROM Group_Members JOIN Users ON Group_Members.member_id = Users.user_id WHERE Group_Members.group_id = ?`;
  db.query(q, [groupId], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json(data);
  });
});

// Add a user to a group
router.post("/:groupId/members", (req, res) => {
  const { groupId } = req.params;
  const { member_id } = req.body;
  const q =
    "INSERT INTO Group_Members (group_id, member_id, date_added) VALUES (?, ?, NOW())";
  db.query(q, [groupId, member_id], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.status(201).json({
      id: data.insertId,
      group_id: groupId,
      member_id,
      date_added: new Date(),
    });
  });
});

// Remove a user from a group
router.delete("/:groupId/members/:memberId", (req, res) => {
  const { groupId, memberId } = req.params;
  const q = "DELETE FROM Group_Members WHERE group_id = ? AND member_id = ?";
  db.query(q, [groupId, memberId], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.status(204).end();
  });
});

export default router;
