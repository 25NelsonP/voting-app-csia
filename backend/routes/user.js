import express from "express";
import db from "../db.js";

const router = express.Router();

//get user route
router.get("/", (req, res) => {
  const q = "SELECT user_id, name, email FROM users";
  db.query(q, (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json(data);
  });
});

// Example of another route
router.get("/admins", (req, res) => {
  const q = "SELECT user_id, name, email FROM users where is_admin = 1";
  db.query(q, (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json(data);
  });
});

//get non admin users
router.get("/non_admins", (req, res) => {
  const q = "SELECT user_id, name, email FROM users where is_admin = 0";
  db.query(q, (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json(data);
  });
});

//update a user as admin
router.put("/set_admin/:id", (req, res) => {
  const user_id = req.params.id;
  const is_admin = req.body.is_admin;
  const q = "UPDATE users SET is_admin = ? WHERE user_id = ?";

  db.query(q, [is_admin, user_id], (err, data) => {
    if (err) return res.json(err);
    return res.json("User admin status updated");
  });
});
export default router;
