const teamModel=require("../models/teamModel");

exports.getTeams=(req,res)=>{
    teamModel.getAllTeams((err,results)=>{
        if(err){
            return res.status(500).json({error:err.message});
        }
        res.json(results);
    });
};

exports.addTeam=(req,res)=>{
    const { team_name, coach_name } = req.body;
    if (!team_name) {
        return res.status(400).json({ message: "Team name is required" });
    }
    teamModel.createTeam({team_name,coach_name},(err,result)=>{
        if(err){
            return res.status(400).json({error:err.message});
        }
    res.status(201).json({
          message: "Team created successfully",
          team_id: result.insertId
    });   
});
};

exports.deleteTeam = (req, res) => {
  const { id } = req.params;

  teamModel.deleteTeam(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Team deleted successfully" });
  });
};