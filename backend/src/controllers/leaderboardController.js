const leaderboardModel = require("../models/leaderboardModel");

exports.getLeaderboard = (req, res) => {
  const { tournament_id } = req.params;

  leaderboardModel.getLeaderboard(tournament_id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
};