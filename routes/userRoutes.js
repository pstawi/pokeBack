import express from 'express';
import checkToken from '../middleware/checkToken.js';
import {register, login, getProfile, updateProfile, updatePassword} from '../controllers/userControllers.js';

// création du router permettant de gérer les routes liées aux utilisateurs
const router = express.Router();


    // route d'inscription utilisateur avec appel de la fonction register
    // cette fonction est importée depuis le fichier userControllers.js
router.post('/register', register);

// route de connexion
router.post('/login', login);

// route de récupération des informations utilisateur
router.get('/profile', checkToken, getProfile);

// route de mise à jour du profil utilisateur
router.put('/profile/update', checkToken, updateProfile);     

// route modification du mot de passe
router.put('/profile/password', checkToken, updatePassword);


export default router;
