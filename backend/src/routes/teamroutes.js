const express=require("express");
const router=express.Router();

const teamcontroller=require("../controllers/teamcontroller");

router.get("/",teamcontroller.getTeams);

router.post("/",teamcontroller.addTeam);

router.delete("/:id", teamcontroller.deleteTeam);

module.exports=router;