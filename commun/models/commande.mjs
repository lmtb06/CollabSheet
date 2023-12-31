export default class Commande {
    constructor(effectuee, auteur, document) {
        this.effectuee = effectuee;
        this.auteur = auteur; // Instance de Compte
        this.document = document; // Instance de Document
    }

    executer() {
        
    }

    annuler() {
        
    }
}

export class ModificationCellule extends Commande {
    constructor(effectuee, auteur, document, numeroFeuille, ligne, colonne, ancienneValeur, nouvelleValeur) {
        super(effectuee, auteur, document);
        this.numeroFeuille = numeroFeuille;
        this.ligne = ligne;
        this.colonne = colonne;
        this.ancienneValeur = ancienneValeur;
        this.nouvelleValeur = nouvelleValeur;
    }

    executer() {
        if (this.effectuee) {
            return;
        } else {
            this.document.feuilles[this.numeroFeuille].cellules[this.ligne][this.colonne].contenu = this.nouvelleValeur;
        }
    }

    annuler() {
        if (!this.effectuee) {
            return;
        } else {
            this.document.feuilles[this.numeroFeuille].cellules[this.ligne][this.colonne].contenu = this.ancienneValeur;
        }
    }
}
