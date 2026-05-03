const playerModel = require("../models/playerModel");

exports.addPlayer = (req, res) => {
  const { name, age, gender, team_id } = req.body;

  if (!name || !team_id) {
    return res.status(400).json({ message: "Name and team_id required" });
  }

    playerModel.checkTeamExists(team_id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid team_id" });
    }

    playerModel.createPlayer({ name, age, gender, team_id }, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        message: "Player added",
        id: data.insertId
      });
    });
  });
};

exports.getPlayersByTeam = (req, res) => {
  const { team_id } = req.params;

    playerModel.checkTeamExists(team_id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid team_id" });
    }

    playerModel.getPlayersByTeam(team_id, (err, data) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json(data);
    });
  });
};

exports.deletePlayer = (req, res) => {
  const { id } = req.params;

  playerModel.deletePlayer(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Player deleted successfully" });
  });
};