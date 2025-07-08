import db from '../configuration/bd.js';

export const deleteTeams = (idTeams) => {
    const deleteTeams = "DELETE FROM teams WHERE idTeams = ?";

    return db.query(deleteTeams, [idTeams]);
}