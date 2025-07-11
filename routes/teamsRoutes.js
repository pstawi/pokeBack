import express from 'express';
import db from '../configuration/bd.js';
import checkToken from '../middleware/checkToken.js';
import { deleteTeams } from '../controllers/teamsControllers.js';

const router = express.Router();

// route création équipe
router.post('/teams', checkToken, async (req, res) => {

    const teamName = req.body.teamName;
    const userId = req.user.idUser; // Récupération de l'ID utilisateur depuis le token
    const createTeam = "INSERT INTO teams (teamName, userId) VALUES (?, ?);";

    try {
        // Exécution de la requête pour créer l'équipe
        await db.query(createTeam, [teamName, userId]);
        res.status(201).json({ message: "Équipe créée avec succès" });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'équipe", error });

    }


});

//route ajout Pokémon à une équipe
router.post('/teams/:idTeams/pokemon', checkToken, async (req, res) => {
    const idTeams = req.params.idTeams; // récupération de l'ID de l'équipe depuis les paramètres de la requête
    const pokemonName = req.body.pokemonName; // récupération du nom du Pokémon depuis le corps de la requête

    // récupération de l'équipe pour vérifier la position du pokemon
    const equipePokemon = "SELECT pkm1, pkm2, pkm3, pkm4, pkm5, pkm6 FROM teams WHERE idTeams = ?;"


    try {
        // récupération de l'équipe dans la bdd
        const [pokemonTab] = await db.query(equipePokemon, [idTeams]);

        const team = pokemonTab[0]; // Récupération de l'équipe

        // res.status(200).json({ team });

        // vérification si le pokemon est déjà dans l'équipe
        if (team.pkm1 === pokemonName || team.pkm2 === pokemonName ||
            team.pkm3 === pokemonName || team.pkm4 === pokemonName ||
            team.pkm5 === pokemonName || team.pkm6 === pokemonName) {
            return res.status(400).json({ message: "Ce Pokémon est déjà dans l'équipe" });
        }

        // trouver la colonne vide pour ajouter le Pokémon
        let columnToUpdate = 'null';

        // Vérification de chaque colonne pour trouver la première colonne vide
        if (!team.pkm1) {
            columnToUpdate = 'pkm1';
            console.log(columnToUpdate);
        } else if (!team.pkm2) {
            columnToUpdate = 'pkm2';
            console.log(columnToUpdate);
        } else if (!team.pkm3) {
            columnToUpdate = 'pkm3';
            console.log(columnToUpdate);
        } else if (!team.pkm4) {
            columnToUpdate = 'pkm4';
            console.log(columnToUpdate);
        } else if (!team.pkm5) {
            columnToUpdate = 'pkm5';
        } else if (!team.pkm6) {
            columnToUpdate = 'pkm6';
        }

        // requete pour ajouter le Pokémon dans la colonne trouvée
        const ajoutPokemon = `UPDATE teams SET ${columnToUpdate} = ? WHERE idTeams = ?;`;

        // ajout du pokemon dans l'équipe
        await db.query(ajoutPokemon, [pokemonName, idTeams]);

        res.status(200).json({ message: `Le Pokémon ${pokemonName} a été ajouté à l'équipe avec succès` });

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du Pokémon à l'équipe", error });

    }
});

// route pour récupérer les équipes d'un utilisateur
router.get('/chooseTeams', checkToken, async (req, res) => {
    const userId = req.user.idUser; // Récupération de l'ID utilisateur depuis le token
    const getTeams = "select * from teams where userId = ? and ( pkm1 is null or pkm2 is null or pkm3 is null or pkm4 is null or pkm5 is null or pkm6 is null);";

    try {
        // Exécution de la requête pour récupérer les équipes de l'utilisateur
        const [teams] = await db.query(getTeams, [userId]);
        console.log(teams);
        res.status(200).json(teams);

    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des équipes", error });

    }
});

// route pour récupérer les équipe d'un utilisateur
router.get('/userTeams', checkToken, async (req, res) => {
    const userId = req.user.idUser; // Récupération de l'ID utilisateur depuis le token
    const getUserTeams = "SELECT teamName, pkm1, pkm2, pkm3, pkm4, pkm5, pkm6, idTeams FROM teams WHERE userId = ?;";

    try {

        const [userTeams] = await db.query(getUserTeams, [userId]);

        // console.log(userTeams);

        // création d'un tableau pour stocker les équipes de l'utilisateur
        // et les Pokémon associés
        const pokemonTeam = userTeams.map(team => {
            const pkm = [team.pkm1, team.pkm2, team.pkm3, team.pkm4, team.pkm5, team.pkm6].filter(Boolean)

            return {
                teamName: team.teamName,
                pkm: pkm,
                idTeams: team.idTeams
            }
        })

        // console.log(pokemonTeam);
        

        res.status(200).json(pokemonTeam);

    } catch (error) {

        res.status(400).json({ message: "cpt" })
        console.error(error);

    }
})

router.delete('/deleteTeam/:idTeams', checkToken, deleteTeams);


export default router;