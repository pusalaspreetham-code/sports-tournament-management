const tournamentModel = require("../models/tournamentModel");

exports.getTournaments = (req, res) => {
  tournamentModel.getAllTournaments((err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.createTournament = (req, res) => {
  const { name, location, start_date, end_date } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Tournament name is required" });
  }

  if (start_date && end_date && start_date > end_date) {
    return res.status(400).json({ message: "Invalid dates" });
  }

  const newTournament = { name, location, start_date, end_date };

  tournamentModel.createTournament(newTournament, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      message: "Tournament created successfully",
      tournament_id: result.insertId
    });
  });
};