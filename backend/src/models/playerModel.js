const db = require("../config/db");

// Check if team exists
exports.checkTeamExists = (team_id, callback) => {
  db.query("SELECT team_id FROM Teams WHERE team_id = ?",[team_id],callback
  );
};

// Create player
exports.createPlayer = (player, callback) => {
  const { name, age, gender, team_id } = player;

  db.query(
    "INSERT INTO Players (name, age, gender, team_id) VALUES (?, ?, ?, ?)",[name, age, gender, team_id],callback
  );
};

// Get players by team
exports.getPlayersByTeam = (team_id, callback) => {
  db.query(
    "SELECT * FROM Players WHERE team_id = ?",[team_id],callback
  );
};

exports.deletePlayer = (player_id, callback) => {
  db.query("DELETE FROM Players WHERE player_id = ?", [player_id], callback);
};