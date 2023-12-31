import jwt from 'jsonwebtoken';
import Compte from '../models/compte/compte.js';

// Fonction pour vérifier le token JWT et obtenir le compte utilisateur
export async function verifyTokenAndGetAccount(token) {
    if (!token) {
        throw new Error('Accès refusé, token non fourni');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        throw new Error('Accès refusé, token invalide');
    }

    const compte = await Compte.findById(decoded.idCompte);
    if (!compte) {
        throw new Error('Utilisateur non trouvé');
    }

    return compte;
}


export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const compte = await verifyTokenAndGetAccount(token);
        req.compte = compte;
        next();
    } catch (error) {
        // Set the error status to 401 (unauthorized) if the token is invalid or not provided
        // and go to the next middleware
        error.status = 401;
        next(error);
    }
};


