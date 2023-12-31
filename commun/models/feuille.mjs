export default class Feuille {
    constructor(id, document, nom, cellules) {
        this.id = id;
        this.document = document; // Instance de Document
        this.nom = nom;
        this.cellules = cellules; // cellules devrait être un tableau 2D de Cellule
    }
}
