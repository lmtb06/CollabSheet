export default class HistoriqueCommande {
    constructor(indexCourant, commandes) {
        this.indexCourant = indexCourant;
        this.commandes = commandes; // Tableau de Commande
    }

    ajouterCommande(commande) {
        // Ajoute une commande à l'historique
        commandes.push(commande);
    }

    undo() {
        // Annule la dernière commande
        commandes[indexCourant].annuler();
        if (indexCourant > 0) {
            indexCourant--;
        }
    }

    redo() {
        // Réexécute la dernière commande annulée
        commandes[indexCourant].executer();
        if (indexCourant < commandes.length - 1) {
            indexCourant++;
        }
    }
}
