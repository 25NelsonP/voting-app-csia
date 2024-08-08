import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all elections
router.get("/", (req, res) => {
  const q = "SELECT * FROM Elections";
  db.query(q, (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json(data);
  });
});

//get a specific election
router.get("/:id", (req, res) => {
  const q = "SELECT * FROM Elections WHERE election_id = ?";
  const id = req.params.id;
  db.query(q, [id], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json(data[0]);
  });
});

// Get elections for a specific user
router.get("/user/:id", (req, res) => {
  const q =
    "SELECT Elections.election_id, Elections.title, Elections.start_date, Elections.end_date FROM EligibleVoters INNER JOIN Elections ON Elections.election_id = EligibleVoters.election_id WHERE EligibleVoters.student_id = ?;"; // to replace 1 with ? after login and session is implemented
  const id = req.params.id;
  db.query(q, [id], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json(data);
  });
});

// Add a new election
router.post("/", (req, res) => {
  const q = `INSERT INTO Elections (title) VALUES ('untitled election');`;

  db.query(q, (err, data) => {
    if (err) return res.json("Error" + err);
    return res
      .status(201)
      .json({ election_id: data.insertId, title: "untitled election" });
  });
});

// Update election title
router.put("/", (req, res) => {
  const { election_id, title } = req.body;
  const q = `UPDATE Elections SET title =? WHERE election_id =?;`;

  db.query(q, [title, election_id], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json("Election Title Updated");
  });
});

// Delete an election
router.delete("/", (req, res) => {
  const q = `DELETE FROM Elections WHERE election_id =?;`;

  db.query(q, [req.body.election_id], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.status(204).end();
  });
});

// Add a new candidate
router.post("/candidates", (req, res) => {
  const { position_id, name, grade, img_url } = req.body;
  const q = `INSERT INTO Candidates (position_id, name, grade, img_url) VALUES (?, ?, ?, ?);`;

  db.query(q, [position_id, name, grade, img_url], (err, data) => {
    if (err) return res.json("Error" + err);
    return res
      .status(201)
      .json({ candidate_id: data.insertId, name, grade, img_url });
  });
});

// Update candidate information
router.put("/candidates", (req, res) => {
  const { candidate_id, name, grade, img_url } = req.body;
  const q = `UPDATE Candidates SET name = ?, grade = ?, img_url = ? WHERE candidate_id = ?;`;

  db.query(q, [name, grade, img_url, candidate_id], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json("Candidate Information Updated");
  });
});

// Delete a candidate
router.delete("/candidates/:id", (req, res) => {
  const q = `DELETE FROM Candidates WHERE candidate_id = ?;`;
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.status(204).end();
  });
});

// Get positions and candidates for a specific election
router.get("/positions/:election_id", (req, res) => {
  const electionId = req.params.election_id;

  // Query to fetch positions based on election_id
  const positionsQuery =
    "SELECT position_id, title FROM Positions WHERE election_id = ?";

  // Query to fetch candidates for those positions
  const candidatesQuery =
    "SELECT candidate_id, position_id, name, grade, img_url FROM Candidates WHERE position_id IN (?)";

  db.query(positionsQuery, [electionId], (err, positions) => {
    if (err) {
      return res.status(500).json("Error fetching positions: " + err);
    }

    // Extract position_ids to use in the candidates query
    const positionIds = positions.map((position) => position.position_id);

    if (positionIds.length === 0) {
      // No positions found, return empty array
      return res.json([]);
    }

    db.query(candidatesQuery, [positionIds], (err, candidates) => {
      if (err) {
        return res.status(500).json("Error fetching candidates: " + err);
      }

      // Combine positions with their corresponding candidates
      const combinedData = positions.map((position) => ({
        ...position,
        candidates: candidates.filter(
          (candidate) => candidate.position_id === position.position_id
        ),
      }));

      return res.json(combinedData);
    });
  });
});

// Add a new position
router.post("/positions", (req, res) => {
  const { election_id, title } = req.body;
  const q = `INSERT INTO Positions (election_id, title) VALUES (?, ?);`;
  console.log(election_id, title);

  db.query(q, [election_id, title], (err, data) => {
    if (err) {
      console.log("Error:", err);
      return res.status(500).json({ error: "Database error: " + err });
    }

    const newPosition = { position_id: data.insertId, title, candidates: [] };
    console.log("New Position:", newPosition);

    return res.status(201).json(newPosition);
  });
});

// Update position information
router.put("/positions", (req, res) => {
  const { position_id, title } = req.body;
  const q = `UPDATE Positions SET title = ? WHERE position_id = ?;`;

  db.query(q, [title, position_id], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.json("Position Information Updated");
  });
});

// Delete a position
router.delete("/positions/:id", (req, res) => {
  const q = `DELETE FROM Positions WHERE position_id = ?;`;
  console.log(req.params.id);
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json("Error" + err);
    return res.status(204).end();
  });
});

export default router;
