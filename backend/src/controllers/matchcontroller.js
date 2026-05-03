const matchModel = require("../models/matchModel");

// Generate matches (Round Robin)
exports.generateMatches = (req, res) => {
  const { tournament_id } = req.params;

  // Step 1: Get registered teams
  matchModel.getRegisteredTeams(tournament_id, (err, teams) => {
    if (err) return res.status(500).json({ error: err.message });

    if (teams.length < 2) {
      return res.status(400).json({ message: "At least 2 teams required" });
    }

    let matchesCreated = 0;

    // Step 2: Round robin pairing
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {

        const team1_id = teams[i].team_id;
        const team2_id = teams[j].team_id;

        // Step 3: Insert match
        matchModel.insertMatch(
          { tournament_id, team1_id, team2_id },
          (err) => {
            if (err) {
              console.error(err);
            }
          }
        );

        matchesCreated++;
      }
    }

    // Step 4: Response
    res.json({
      message: "Matches generated successfully",
      total_matches: matchesCreated
    });
  });
};

// Get matches by tournament
exports.getMatchesByTournament = (req, res) => {
  const { tournament_id } = req.params;

  matchModel.getMatchesByTournament(tournament_id, (err, matches) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json(matches);
  });
};

// Update match winner
exports.updateWinner = (req, res) => {
  const { match_id } = req.params;
  let { winner_id } = req.body;   // ✅ use let

  // Step 1: Get match
  matchModel.getMatchById(match_id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ message: "Match not found" });
    }

    const match = result[0];

    // ✅ Step 2: Handle tie FIRST
    if (winner_id === "tie") {
      winner_id = null;
    } else {
      // ✅ Step 3: Validate winner
      if (
        Number(winner_id) !== match.team1_id &&
        Number(winner_id) !== match.team2_id
      ) {
        return res.status(400).json({
          message: "Winner must be one of the playing teams"
        });
      }
    }

    // Step 4: Update winner
    matchModel.updateWinner(match_id, winner_id, (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Winner updated successfully" });
    });
  });
};

exports.deleteMatch = (req, res) => {
  const { id } = req.params;

  matchModel.deleteMatch(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Match deleted successfully" });
  });
};