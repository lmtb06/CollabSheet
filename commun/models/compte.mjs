export default class Compte {
    constructor(id, nom, prenom, email, motDePasse, avatar, emailVerifie, dateDeCreation, dateDeModification) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motDePasse = motDePasse;
        this.avatar = avatar;
        this.emailVerifie = emailVerifie;
        this.dateDeCreation = dateDeCreation;
        this.dateDeModification = dateDeModification;
    }
}
