import express from "express";
import db from "../db.js";

const router = express.Router();

//get election form route
router.get("/elections", (req, res) => {
  const q = "SELECT * FROM elections";
  db.query(q, (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json(data);
  });
});

// Example of another route
router.get("/user_elections", (req, res) => {
  const q =
    "SELECT elections.election_id, elections.title, elections.start_date, elections.end_date FROM eligiblevoters INNER JOIN Elections ON Elections.election_id = EligibleVoters.election_id where EligibleVoters.student_id = 1;"; // to replace 1 with ? after login and session is implemented
  db.query(q, (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json(data);
  });
});

router.get("/non_admins", (req, res) => {
  const q = "SELECT user_id, name, email FROM users where is_admin = 0";
  db.query(q, (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json(data);
  });
});

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
