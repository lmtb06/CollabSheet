export default class Document {
    constructor(id, titre, dateDeCreation, dateDeModification, feuilles, proprietaire, permissions, historiqueCommandes) {
        this.id = id;
        this.titre = titre;
        this.dateDeCreation = dateDeCreation;
        this.dateDeModification = dateDeModification;
        this.feuilles = feuilles; // Tableau de Feuille
        this.proprietaire = proprietaire; // Instance de Compte
        this.permissions = permissions; // Tableau de Permission
        this.historiqueCommandes = historiqueCommandes; // Instance de HistoriqueCommande
    }
}
