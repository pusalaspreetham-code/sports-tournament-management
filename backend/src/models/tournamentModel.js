const db=require("../config/db.js");
exports.getAllTournaments=(callback)=>{
    db.query("SELECT * FROM Tournaments",callback);
};

exports.createTournament=(tournament,callback)=>{
    const { name,start_date, end_date } = tournament;
    db.query("INSERT INTO Tournaments (name, start_date, end_date) VALUES (?, ?, ?)",
    [name,start_date, end_date],callback);
};