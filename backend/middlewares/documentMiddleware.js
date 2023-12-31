import Document from '../models/document/document.js'

// Middleware pour vérifier les permissions d'un utilisateur sur un document
export const verifierPermissionMiddleware = (niveauRequis) => async (req, res, next) => {
    const { id } = req.params;
    const idCompte = req.compte._id;
    const document = await Document.findById(id).populate('permissions');
    try{
        if (!document) {
            let error =  new Error('Document non trouvé');
            error.status = 404;
            throw error;
        }
    
        const hasPermission = await verifierPermission(document, idCompte, niveauRequis);
        if (!hasPermission) {
            let error =  new Error('Action non autorisée');
            error.status = 403;
            throw error;
        }
        req.document = document; // stocke le document dans l'objet de requête pour usage ultérieure
        next();
    } catch (error) {
        next(error);
    }

    
};

// Fonction pour vérifier si l'utilisateur a la permission requise sur un document
export const verifierPermission = async (document, idCompte, niveauRequis) => {
    const isOwner = document.proprietaire.toString() === idCompte.toString();
    if (isOwner) {
        return true; // Le propriétaire a toujours le niveau de permission maximal
    }

    const hasRequiredPermission = document.permissions.some(permission =>
        permission.compte.toString() === idCompte.toString() && permission.accessLevel >= NiveauPermission[niveauRequis]);

    return hasRequiredPermission;
};

