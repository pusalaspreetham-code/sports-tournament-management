const express = require("express");
const router = express.Router();

const registrationController = require("../controllers/registrationController");
router.get("/", registrationController.getRegistrations);
router.post("/", registrationController.createRegistration);
router.get("/:tournament_id", registrationController.getTeamsByTournament);
module.exports = router;