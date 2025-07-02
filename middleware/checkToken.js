import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const checkToken = (req, res, next) => {
    // utilisation de dotenv pour charger les variables d'environnement
    dotenv.config();
    console.log(req.headers['authorization']);

    // récupération du token dans les headers
    const token = req.headers['authorization'];

    // si le token n'est pas présent, on renvoie une erreur
    if (!token) {
        return res.status(403).json({ message: "Token manquant" });
    }

    // vérification du token
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token invalide" });
        }
        // si le token est valide, on passe à la suite       
        req.user = decoded;
        next();
    });
    
}

export default checkToken;