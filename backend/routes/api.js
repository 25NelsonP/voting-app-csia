import express from "express";

const router = express.Router();

// Define your routes here
router.get("/", (req, res) => {
  res.send("Hello from API");
});

// Example of another route
router.get("/example", (req, res) => {
  res.send("This is an example route");
});

export default router;
