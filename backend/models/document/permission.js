import { NiveauPermission, Permission } from "../../../commun/models/permission.mjs";
import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true
  },
  compte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Compte",
    required: true
  },
  niveauPermission: {
    type: String,
    enum: NiveauPermission,
    default: NiveauPermission.LECTURE,
  },
});

permissionSchema.loadClass(Permission);

export default mongoose.model("Permission", permissionSchema);
