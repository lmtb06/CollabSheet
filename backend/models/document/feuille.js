import mongoose from "mongoose";
import Feuille from "../../../commun/models/feuille.mjs";
const { Schema } = mongoose;

const feuilleSchema = new Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  nom: {
    type: String,
    default: "Sans titre"
  },
  cellules: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cellule',
      required: true
    }
  ],
});

feuilleSchema.loadClass(Feuille);

export default mongoose.model("Feuille", feuilleSchema);
