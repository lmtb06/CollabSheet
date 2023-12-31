import mongoose from 'mongoose';
import Commande, { ModificationCellule } from '../../../commun/models/commande.mjs';

const commandeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    // Si la commande a été effectuée
    effectuee: {
        type: Boolean,
        default: false
    },
    // Personne qui a effectué la commande
    auteur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Compte',
        required: true
    },
    // Document sur lequel la commande a été effectuée
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    }
}, { discriminatorKey: 'type' });
commandeSchema.loadClass(Commande);

export default mongoose.model('Commande', commandeSchema);


const modificationCelluleSchema = new mongoose.Schema({
    // numéro de la feuille
    numeroFeuille: {
        type: Number,
        required: true
    },
    // ligne de la cellule
    ligne: {
        type: Number,
        required: true
    },
    // colonne de la cellule
    colonne: {
        type: Number,
        required: true
    },
    // nouvelle valeur de la cellule
    nouvelleValeur: {
        type: String,
        required: true
    },
    // ancienne valeur de la cellule
    ancienneValeur: {
        type: String,
        required: true
    }
});

modificationCelluleSchema.loadClass(ModificationCellule);

export const ModificationCellule = Commande.discriminator('ModificationCellule', modificationCelluleSchema);

