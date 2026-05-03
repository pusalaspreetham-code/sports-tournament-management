const db = require("../config/db");

exports.getLeaderboard = (tournament_id, callback) => {
  const query = `
    SELECT t.team_id,t.team_name,COUNT(m.match_id) AS matches_played,
      SUM(CASE WHEN m.winner_id = t.team_id THEN 1 ELSE 0 END) AS wins,
      SUM(CASE WHEN m.winner_id = t.team_id THEN 2 ELSE 0 END) AS points
    FROM Teams t JOIN Matches m 
      ON t.team_id = m.team1_id OR t.team_id = m.team2_id
    WHERE m.tournament_id = ?
    GROUP BY t.team_id
    ORDER BY points DESC
  `;

  db.query(query, [tournament_id], callback);
};