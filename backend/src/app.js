const express = require("express");
const fs      = require("fs");
const cors    = require("cors");
const db      = require("./config/db");

const teamRoutes          = require("./routes/teamroutes");
const playerRoutes        = require("./routes/playerRoutes");
const matchRoutes         = require("./routes/matchRoutes");
const registrationsRoutes = require("./routes/registraionRoutes");
const tournamentRoutes    = require("./routes/tournamentRoutes");
const leaderboardRoutes   = require("./routes/leaderboardRoutes");

const app  = express();
const FILE = "data.json";

app.use(cors());
app.use(express.json());

// ═══════════════════════════════════════════════════════════
//  FILE HELPERS
// ═══════════════════════════════════════════════════════════
function readData() {
  if (!fs.existsSync(FILE)) return {};
  try { return JSON.parse(fs.readFileSync(FILE)); } catch { return {}; }
}

function writeData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

// Return the user object, creating it if missing.
// Also handles back-compat where old format stored a plain array.
function getUser(data, userId) {
  if (!data[userId]) {
    data[userId] = { tournaments: [], teams: [], players: [], registrations: [], matches: [] };
  }
  if (Array.isArray(data[userId])) {
    data[userId] = {
      tournaments:   data[userId],
      teams:         [],
      players:       [],
      registrations: [],
      matches:       []
    };
  }
  return data[userId];
}

// ═══════════════════════════════════════════════════════════
//  TOURNAMENTS
// ═══════════════════════════════════════════════════════════

app.post("/api/user-tournament", (req, res) => {
  const { userId, tournament_id } = req.body;
  if (!userId || !tournament_id)
    return res.status(400).json({ error: "userId and tournament_id required" });

  const data = readData();
  const user = getUser(data, userId);
  if (!user.tournaments.includes(tournament_id)) user.tournaments.push(tournament_id);
  writeData(data);
  res.json({ message: "Saved" });
});

app.get("/api/user-tournaments/:userId", (req, res) => {
  const data = readData();
  const user = getUser(data, req.params.userId);
  const ids  = user.tournaments;
  if (!ids.length) return res.json([]);

  db.query(
    "SELECT * FROM Tournaments WHERE tournament_id IN (?)",
    [ids],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});

// ═══════════════════════════════════════════════════════════
//  TEAMS  (fully per-user)
// ═══════════════════════════════════════════════════════════

// Create team and record ownership in data.json
app.post("/api/user-teams", (req, res) => {
  const { userId, team_name, coach_name } = req.body;
  if (!userId || !team_name)
    return res.status(400).json({ error: "userId and team_name required" });

  db.query(
    "INSERT INTO Teams (team_name, coach_name) VALUES (?, ?)",
    [team_name, coach_name || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      const team_id = result.insertId;
      const data    = readData();
      const user    = getUser(data, userId);
      user.teams.push(team_id);
      writeData(data);
      res.status(201).json({ message: "Team created", team_id });
    }
  );
});

// Get only this user's teams
app.get("/api/user-teams/:userId", (req, res) => {
  const data = readData();
  const user = getUser(data, req.params.userId);
  const ids  = user.teams;
  if (!ids.length) return res.json([]);

  db.query(
    "SELECT * FROM Teams WHERE team_id IN (?)",
    [ids],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});

// Delete team owned by this user
app.delete("/api/user-teams/:userId/:teamId", (req, res) => {
  const { userId, teamId } = req.params;
  const id = parseInt(teamId);

  // Verify ownership
  const data = readData();
  const user = getUser(data, userId);
  if (!user.teams.includes(id))
    return res.status(403).json({ error: "Team not found for this user" });

  db.query("DELETE FROM Teams WHERE team_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    user.teams = user.teams.filter(t => t !== id);
    // Also remove any players + registrations owned by this user for this team
    writeData(data);
    res.json({ message: "Team deleted" });
  });
});

// ═══════════════════════════════════════════════════════════
//  PLAYERS  (fully per-user)
// ═══════════════════════════════════════════════════════════

// Add player and record ownership
app.post("/api/user-players", (req, res) => {
  const { userId, name, age, gender, team_id } = req.body;
  if (!userId || !name || !team_id)
    return res.status(400).json({ error: "userId, name, team_id required" });

  // Verify team belongs to user
  const data = readData();
  const user = getUser(data, userId);
  if (!user.teams.includes(parseInt(team_id)))
    return res.status(403).json({ error: "Team not found for this user" });

  db.query(
    "INSERT INTO Players (name, age, gender, team_id) VALUES (?, ?, ?, ?)",
    [name, age || null, gender || null, team_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      const player_id = result.insertId;
      user.players.push(player_id);
      writeData(data);
      res.status(201).json({ message: "Player added", player_id });
    }
  );
});

// Get players for a specific team — only those owned by this user
app.get("/api/user-players/:userId/:teamId", (req, res) => {
  const { userId, teamId } = req.params;
  const data        = readData();
  const user        = getUser(data, userId);
  const myPlayerIds = user.players;

  if (!myPlayerIds.length) return res.json([]);

  db.query(
    "SELECT * FROM Players WHERE team_id = ? AND player_id IN (?)",
    [teamId, myPlayerIds],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});

// Delete player owned by this user
app.delete("/api/user-players/:userId/:playerId", (req, res) => {
  const { userId, playerId } = req.params;
  const id   = parseInt(playerId);
  const data = readData();
  const user = getUser(data, userId);

  if (!user.players.includes(id))
    return res.status(403).json({ error: "Player not found for this user" });

  db.query("DELETE FROM Players WHERE player_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    user.players = user.players.filter(p => p !== id);
    writeData(data);
    res.json({ message: "Player deleted" });
  });
});

// ═══════════════════════════════════════════════════════════
//  REGISTRATIONS  (fully per-user, min 12 players enforced)
// ═══════════════════════════════════════════════════════════

app.post("/api/user-registrations", (req, res) => {
  const { userId, team_id, tournament_id } = req.body;
  if (!userId || !team_id || !tournament_id)
    return res.status(400).json({ error: "userId, team_id, tournament_id required" });

  const data = readData();
  const user = getUser(data, userId);

  // Ownership checks
  if (!user.teams.includes(parseInt(team_id)))
    return res.status(403).json({ error: "Team not found for this user" });
  if (!user.tournaments.includes(parseInt(tournament_id)))
    return res.status(403).json({ error: "Tournament not found for this user" });

  // Duplicate check
  const already = user.registrations.some(
    r => r.team_id === parseInt(team_id) && r.tournament_id === parseInt(tournament_id)
  );
  if (already)
    return res.status(400).json({ message: "Team already registered in this tournament" });

  // Count user's own players for this team
  const myPlayerIds = user.players.length ? user.players : [0];
  db.query(
    "SELECT player_id FROM Players WHERE team_id = ? AND player_id IN (?)",
    [team_id, myPlayerIds],
    (err, players) => {
      if (err) return res.status(500).json({ error: err.message });
      if (players.length < 12)
        return res.status(400).json({
          message: `Minimum 12 players required. This team currently has ${players.length} player(s).`
        });

      db.query(
        "INSERT INTO Registrations (team_id, tournament_id) VALUES (?, ?)",
        [team_id, tournament_id],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          user.registrations.push({
            registration_id: result.insertId,
            team_id:         parseInt(team_id),
            tournament_id:   parseInt(tournament_id)
          });
          writeData(data);
          res.status(201).json({ message: "Registration successful", registration_id: result.insertId });
        }
      );
    }
  );
});

// Get teams registered in a tournament for this user
app.get("/api/user-registrations/:userId/:tournamentId", (req, res) => {
  const { userId, tournamentId } = req.params;
  const data       = readData();
  const user       = getUser(data, userId);
  const teamIds    = user.registrations
    .filter(r => r.tournament_id === parseInt(tournamentId))
    .map(r => r.team_id);

  if (!teamIds.length) return res.json([]);

  db.query(
    "SELECT team_id, team_name FROM Teams WHERE team_id IN (?)",
    [teamIds],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});

// ═══════════════════════════════════════════════════════════
//  MATCHES  (fully per-user)
// ═══════════════════════════════════════════════════════════

// Generate round-robin matches using this user's registered teams
app.post("/api/user-matches/generate/:userId/:tournamentId", (req, res) => {
  const { userId, tournamentId } = req.params;
  const data = readData();
  const user = getUser(data, userId);

  if (!user.tournaments.includes(parseInt(tournamentId)))
    return res.status(403).json({ error: "Tournament not found for this user" });

  const teamIds = user.registrations
    .filter(r => r.tournament_id === parseInt(tournamentId))
    .map(r => r.team_id);

  if (teamIds.length < 2)
    return res.status(400).json({ message: "At least 2 registered teams required to generate matches" });

  // Build all pairs
  const pairs = [];
  for (let i = 0; i < teamIds.length; i++)
    for (let j = i + 1; j < teamIds.length; j++)
      pairs.push([teamIds[i], teamIds[j]]);

  let done = 0, created = 0, hasError = false;

  pairs.forEach(([t1, t2]) => {
    db.query(
      "INSERT INTO Matches (tournament_id, team1_id, team2_id) VALUES (?, ?, ?)",
      [tournamentId, t1, t2],
      (err, result) => {
        done++;
        if (!err) { created++; user.matches.push(result.insertId); }
        else hasError = true;

        if (done === pairs.length) {
          writeData(data);
          if (hasError && created === 0)
            return res.status(500).json({ error: "Failed to generate matches" });
          res.json({ message: "Matches generated", total_matches: created });
        }
      }
    );
  });
});

// Get matches for a tournament that belong to this user
app.get("/api/user-matches/:userId/:tournamentId", (req, res) => {
  const { userId, tournamentId } = req.params;
  const data       = readData();
  const user       = getUser(data, userId);
  const myMatchIds = user.matches;

  if (!myMatchIds.length) return res.json([]);

  db.query(
    "SELECT * FROM Matches WHERE tournament_id = ? AND match_id IN (?)",
    [tournamentId, myMatchIds],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});

// Update winner — ownership verified
app.put("/api/user-matches/winner/:userId/:matchId", (req, res) => {
  const { userId, matchId } = req.params;
  let   { winner_id }       = req.body;
  const data                = readData();
  const user                = getUser(data, userId);

  if (!user.matches.includes(parseInt(matchId)))
    return res.status(403).json({ error: "Match not found for this user" });

  db.query("SELECT * FROM Matches WHERE match_id = ?", [matchId], (err, result) => {
    if (err)           return res.status(500).json({ error: err.message });
    if (!result.length) return res.status(404).json({ message: "Match not found" });

    const match = result[0];
    if (winner_id === "tie") {
      winner_id = null;
    } else if (Number(winner_id) !== match.team1_id && Number(winner_id) !== match.team2_id) {
      return res.status(400).json({ message: "Winner must be one of the playing teams" });
    }

    db.query(
      "UPDATE Matches SET winner_id = ? WHERE match_id = ?",
      [winner_id, matchId],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Winner updated" });
      }
    );
  });
});

// Delete match — ownership verified
app.delete("/api/user-matches/:userId/:matchId", (req, res) => {
  const { userId, matchId } = req.params;
  const id   = parseInt(matchId);
  const data = readData();
  const user = getUser(data, userId);

  if (!user.matches.includes(id))
    return res.status(403).json({ error: "Match not found for this user" });

  db.query("DELETE FROM Matches WHERE match_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    user.matches = user.matches.filter(m => m !== id);
    writeData(data);
    res.json({ message: "Match deleted" });
  });
});

// ═══════════════════════════════════════════════════════════
//  LEADERBOARD  (scoped to user's matches only)
// ═══════════════════════════════════════════════════════════

app.get("/api/user-leaderboard/:userId/:tournamentId", (req, res) => {
  const { userId, tournamentId } = req.params;
  const data       = readData();
  const user       = getUser(data, userId);
  const myMatchIds = user.matches;

  if (!myMatchIds.length) return res.json([]);

  db.query(
    `SELECT
       t.team_id,
       t.team_name,
       COUNT(m.match_id) AS matches_played,
       SUM(CASE WHEN m.winner_id = t.team_id THEN 1 ELSE 0 END) AS wins,
       SUM(CASE WHEN m.winner_id = t.team_id THEN 2 ELSE 0 END) AS points
     FROM Teams t
     JOIN Matches m ON t.team_id = m.team1_id OR t.team_id = m.team2_id
     WHERE m.tournament_id = ? AND m.match_id IN (?)
     GROUP BY t.team_id
     ORDER BY points DESC`,
    [tournamentId, myMatchIds],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});

// ═══════════════════════════════════════════════════════════
//  ORIGINAL ROUTES kept for internal use / compatibility
// ═══════════════════════════════════════════════════════════
app.use("/api/teams",         teamRoutes);
app.use("/api/players",       playerRoutes);
app.use("/api/matches",       matchRoutes);
app.use("/api/registrations", registrationsRoutes);
app.use("/api/tournaments",   tournamentRoutes);
app.use("/api/leaderboard",   leaderboardRoutes);

module.exports = app;