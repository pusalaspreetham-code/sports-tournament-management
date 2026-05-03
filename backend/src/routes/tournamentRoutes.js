const express=require("express");
const router=express.Router();

const tournamentcontroller=require("../controllers/tournamentcontroller");

router.get("/",tournamentcontroller.getTournaments);
router.post("/",tournamentcontroller.createTournament);
module.exports = router;