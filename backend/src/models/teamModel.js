const db=require("../config/db.js");

exports.getAllTeams=(callback)=>{
    db.query("select* from Teams",callback);
};

exports.createTeam=(team, callback)=>{
    const{team_name,coach_name}=team;
    db.query("insert into Teams (team_name,coach_name) values(?,?)",[team_name,coach_name],callback);
};
exports.deleteTeam = (team_id, callback) => {
  db.query("DELETE FROM Teams WHERE team_id = ?", [team_id], callback);
};