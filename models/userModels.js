import db from '../configuration/bd.js';


// Fonction pour ajouter un utilisateur dans la base de données
// Cette fonction est appelée depuis le fichier userControllers.js
export const addUser = (name, mail, cryptedPassword) => {

    const insertUser = "INSERT INTO users (name, mail, password) VALUES (?,?,?);";

    // Exécute la requête d'insertion avec les paramètres fournis
    // et retourne le résultat de la requête
    return db.query(insertUser, [name, mail, cryptedPassword]);
}

export const loginUser = (mail) => {
        const selectUser = "SELECT idUser, name, password from users where mail like ?;";

        return db.query(selectUser, [mail]);
}

export const getProfileUser = (userId) => {
    const getProfile = "SELECT idUser, name, mail FROM users WHERE idUser = ?;";

    // Exécute la requête de sélection avec l'ID utilisateur fourni
    return db.query(getProfile, [userId]);
}
export const updateUserProfile = (name, mail, userId) => {
    const updateUser = "UPDATE users SET name = ?, mail = ? WHERE idUser = ?;";
    
    return db.query(updateUser, [name, mail, userId]);
}

export const updateUserPassword = (cryptedNewPassword, userId) => {
     // préparation de la requete de mise à jour
    const updatePassword = "UPDATE users SET password = ? WHERE idUser = ?;";

    // Exécute la requête de mise à jour avec le nouveau mot de passe et l'ID utilisateur
    return db.query(updatePassword, [cryptedNewPassword, userId]);
}

export const getUserPassword = (idUser) => {
    const selectUser = "SELECT password FROM users WHERE idUser = ?;";

    return db.query(selectUser, [idUser])
}