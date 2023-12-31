import mongoose from "mongoose";
import Document from "../../../commun/models/document.mjs";
const { Schema } = mongoose;

const documentSchema = new Schema({
  titre: {
    type: String,
    default: "Sans titre"
  },
  dateDeCreation: {
    type: Date,
    default: Date.now
  },
  dateDeModification: {
    type: Date,
    default: Date.now
  },
  feuilles: [{
    type: Schema.Types.ObjectId,
    ref: "Feuille"
  }],
  proprietaire: {
    type: Schema.Types.ObjectId,
    ref: "Compte"
  },
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: "Permission"
  }],
  historiqueCommandes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HistoriqueCommande',
  }
});

documentSchema.pre("save", function (next) {
  this.dateDeModification = new Date();
  next();
});

// Méthodes pour ajouter ou supprimer des feuilles
documentSchema.methods.addFeuille = function (feuille) {
  this.feuilles.push(feuille);
};

documentSchema.methods.removeFeuille = function (feuilleId) {
  this.feuilles = this.feuilles.filter(
    (f) => f._id.toString() !== feuilleId.toString()
  );
};

documentSchema.pre("save", function (next) {
  this.dateDeModification = new Date();
  next();
});

documentSchema.loadClass(Document);

export default mongoose.model("Document", documentSchema);
