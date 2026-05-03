const express = require("express");
const router = express.Router();

const leaderboardController = require("../controllers/leaderboardController");

router.get("/:tournament_id", leaderboardController.getLeaderboard);

module.exports = router;  