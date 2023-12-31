import mongoose from "mongoose";
import Cellule from "../../../commun/models/cellule.mjs";

const celluleSchema = new mongoose.Schema({
  contenu: { type: String, default: "" },
});

celluleSchema.loadClass(Cellule);

export default mongoose.model("Cellule", celluleSchema);