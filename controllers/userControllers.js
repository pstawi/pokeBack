import dotenv from "dotenv";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userModels from '../models/userModels.js';


dotenv.config();

// fonction d'inscription utilisateur
// cette fonction est appelée depuis le fichier userRoutes.js
export const register = async (req, res) => {


    console.log("je suis dans le controller");
    // récupération des données du corps de la requête
    const {name, mail, password} = req.body;

    try {
        // cryptage du password
        const cryptedPassword = await bcrypt.hashSync(password, 10);

        // appel de la fonction addUser du modèle userModels
        // cette fonction permet d'insérer un nouvel utilisateur dans la base de données
        await userModels.addUser(name, mail, cryptedPassword)
        res.status(201).json({ message: "utilisateur créé"});
        
    } catch (error) {
        // gestion en cas d'erreur
        res.status(500).json({message: "erreur lors de l'inscription", error})
        
    }
}

export const login = async (req, res) => {
    const {mail, password} = req.body;
    try{

        // appel de la fonction loginUser du modèle userModels
        // cette fonction permet de récupérer les données de l'utilisateur à partir de son mail
        const [result] = await userModels.loginUser(mail);

        const userData = result[0];

        if (result){

            const checkPassword = await bcrypt.compare(password, userData.password);
            
            if (checkPassword == true){

                // création du token
                const token = jwt.sign({idUser: userData.idUser, username: userData.name}, process.env.SECRET_KEY, {expiresIn: "6h"});

                res.status(201).json({
                    message: "connexion autorisé",
                    token: token
                });
            } else {
                res.status(403).json({message: "accès refusé"});
            }

        } else {
            res.status(104).json({message: "utilisateur inconnu"})
        }

    } catch (error) {

        res.status(500).json({message: "erreur lors de la connexion", error})
        console.log(error);

    }
}

export const getProfile = async (req, res) => {
        // récupération de l'id de l'utilisateur à partir du token
    // le token est vérifié par le middleware checkToken
    const userId = req.user.idUser;

     try {
        const [result] = await userModels.getProfileUser(userId);

        if (result.length > 0) {
            res.status(200).json(result[0]);
        } else {
            res.status(404).json({message: "utilisateur non trouvé"});
        }

    } catch (error) {
        res.status(500).json({message: "erreur lors de la récupération du profil", error});
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
     // récupération de l'id de l'utilisateur à partir du token
    const userId = req.user.idUser;
   
    // récupération des informations à mettre à jour
    const {name, mail} = req.body;

    try {
        // utilisation de la connexion bdd pour executer la requete
        await userModels.updateUserProfile(name, mail, userId);
        // envoi de la réponse
        res.status(200).json({message: "profil mis à jour"});
    } catch (error) {
        res.status(500).json({message: "erreur lors de la mise à jour du profil", error});
        console.log(error);
    }
}

export const updatePassword = async (req, res) => {

    // récupération de l'id de l'utilisateur à partir du token
    const userId = req.user.idUser;
   
    // récupération des informations à mettre à jour
    const {oldPassword, newPassword} = req.body;

    try {
        // récupération de l'utilisateur pour vérifier l'ancien mot de passe
        const [result] = await userModels.getUserPassword(userId);

        if (result.length > 0) {
            const userData = result[0];
            // vérification de l'ancien mot de passe
            const checkOldPassword = await bcrypt.compare(oldPassword, userData.password);

            if (checkOldPassword) {
                // cryptage du nouveau mot de passe
                const cryptedNewPassword = await bcrypt.hashSync(newPassword, 10);
                // utilisation de la connexion bdd pour executer la requete
                await userModels.updateUserPassword(cryptedNewPassword, userId);
                res.status(200).json({message: "mot de passe mis à jour"});
            } else {
                res.status(403).json({message: "ancien mot de passe incorrect"});
            }
        } else {
            res.status(404).json({message: "utilisateur non trouvé"});
        }
        
    } catch (error) {
        res.status(500).json({message: "erreur lors de la mise à jour du mot de passe", error});
        console.log(error);
    }
}