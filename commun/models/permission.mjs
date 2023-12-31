export const NiveauPermission = {
    LECTURE: 0,
    ECRITURE: 1,
    ADMIN: 2,
    PROPRIETAIRE: 3,
};

export class Permission {
    constructor(id, niveauPermission, compte, document) {
        this.id = id;
        this.niveauPermission = niveauPermission;
        this.compte = compte;
        this.document = document;
    }
}
