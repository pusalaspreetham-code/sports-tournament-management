const registrationModel = require("../models/registrationModel");

// 📥 GET ALL REGISTRATIONS
exports.getRegistrations = (req, res) => {
  registrationModel.getAllRegistrations((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// ➕ CREATE REGISTRATION
exports.createRegistration = (req, res) => {
  const { team_id, tournament_id } = req.body;

  if (!team_id || !tournament_id) {
    return res.status(400).json({
      message: "Team ID and Tournament ID are required"
    });
  }

  registrationModel.createRegistration(
    { team_id, tournament_id },
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Registration created successfully",
        registration_id: result.insertId
      });
    }
  );
};

// 📋 GET TEAMS BY TOURNAMENT
exports.getTeamsByTournament = (req, res) => {
  const { tournament_id } = req.params;

  registrationModel.getTeamsByTournament(tournament_id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};