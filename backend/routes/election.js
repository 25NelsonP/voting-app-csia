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

export default router;
