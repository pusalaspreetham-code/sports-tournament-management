const express=require("express");
const router=express.Router();

const matchcontroller=require("../controllers/matchcontroller");

router.post("/generate/:tournament_id", matchcontroller.generateMatches);

// Update match winner  (must be before /:tournament_id to avoid param conflict)
router.put("/winner/:match_id", matchcontroller.updateWinner);

// Get matches by tournament
router.get("/:tournament_id", matchcontroller.getMatchesByTournament);

router.delete("/:id", matchcontroller.deleteMatch);

module.exports=router;