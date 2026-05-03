const db = require("../config/db");

exports.getAllRegistrations = (callback) => {
  db.query("SELECT * FROM Registrations", callback);
};

exports.createRegistration = (registration, callback) => {
  const { team_id, tournament_id } = registration;

  db.query(
    "INSERT INTO Registrations (team_id, tournament_id) VALUES (?, ?)",
    [team_id, tournament_id],
    callback
  );
};

exports.getTeamsByTournament = (tournament_id, callback) => {
  db.query(
    `SELECT t.team_id, t.team_name FROM Registrations r
     JOIN Teams t ON r.team_id = t.team_id
     WHERE r.tournament_id = ?`,
    [tournament_id],
    callback
  );
};