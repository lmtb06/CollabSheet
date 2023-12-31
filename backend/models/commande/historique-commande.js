import mongoose from 'mongoose';
import HistoriqueCommande from '../../../commun/models/historiqueCommande.mjs';

const historiqueCommandeSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: true
  },
  commandes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commande'
  }],
  indexCourant: {
    type: Number,
    default: -1
  }
});

historiqueCommandeSchema.loadClass(HistoriqueCommande);

export default mongoose.model('HistoriqueCommande', historiqueCommandeSchema);
