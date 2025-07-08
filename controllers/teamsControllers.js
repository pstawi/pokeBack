import * as teamsModels from '../models/teamsModels.js';

export const deleteTeams = async (req,res) => {

    console.log(req.param)
    const idTeams = req.params.idTeams;

    console.log(idTeams)

    try {
        await teamsModels.deleteTeams(idTeams);
        res.status(200).json({message: "équipe supprimée"});
    } catch (error) {
        console.log(error);
        res.status(500)
    }
}