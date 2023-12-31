import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Compte from "../../../commun/models/compte.mjs";

const compteSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: { type: String, unique: true },
  motDePasse: String,
  avatar: { type: String, default: "" },
  emailVerifie: { type: Boolean, default: false },
  dateDeCreation: { type: Date, default: new Date() },
  dateDeModification: Date,
});

// Hash le mot de passe avant de l'enregistrer dans la base de données
compteSchema.pre("save", async function (next) {
  if (this.isModified("motDePasse")) {
    this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
  }
  this.dateDeModification = new Date();
  next();
});

compteSchema.loadClass(Compte);

export default mongoose.model("Compte", compteSchema);
