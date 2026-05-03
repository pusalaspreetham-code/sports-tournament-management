const db=require("../config/db.js");

exports.getRegisteredTeams=(tournament_id,callback)=>{
    db.query("select team_id from Registrations where tournament_id=?",[tournament_id],callback);
};

exports.insertMatch=(match,callback)=>{
    const{tournament_id,team1_id,team2_id}=match;
    db.query("insert into Matches (tournament_id, team1_id, team2_id) VALUES (?, ?, ?)",[tournament_id,team1_id,team2_id],callback);
};

exports.getMatchesByTournament=(tournament_id,callback)=>{
    db.query("select* from Matches where tournament_id=?",[tournament_id],callback);
};

exports.getMatchById = (match_id, callback) => {
  db.query("SELECT * FROM Matches WHERE match_id = ?",[match_id],callback);
};

// Update winner
exports.updateWinner = (match_id, winner_id, callback) => {
  db.query("UPDATE Matches SET winner_id = ? WHERE match_id = ?",[winner_id, match_id],callback);
};

exports.deleteMatch = (match_id, callback) => {
  db.query("DELETE FROM Matches WHERE match_id = ?", [match_id], callback);
};