const express = require("express");
const router = express.Router();

const playerController = require("../controllers/playercontroller");

// Get players by team
router.get("/:team_id", playerController.getPlayersByTeam);

// Add player
router.post("/", playerController.addPlayer);

router.delete("/:id", playerController.deletePlayer);

module.exports = router;