import express from 'express';
import db from '../configuration/bd.js';
import checkToken from '../middleware/checkToken.js';

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

export default router;