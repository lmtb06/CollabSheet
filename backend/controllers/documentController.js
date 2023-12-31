import Document from "../models/document/document.js";
import Permission from "../models/document/permission.js";
import { NiveauPermission } from "../../commun/models/permission.mjs";
import Feuille from "../models/document/feuille.js";
import HistoriqueCommande from "../models/commande/historique-commande.js";
import rooms from "../rooms.js";
import { verifierPermission } from "../middlewares/documentMiddleware.js";


const documentController = {
  /**
   * Création d'un nouveau document
   * 
   */
  createDocument: async (req, res, next) => {
    try {
      const { titre } = req.body;
      const compteId = req.compte._id;
  
      // Création du document sans historiqueCommandes
      const newDocument = new Document({
        titre: titre || Document.schema.obj.titre.default,
        proprietaire: compteId,
      });
      await newDocument.save();
  
      // Création de l'historique de commandes avec référence à document
      const newHistoriqueCommande = new HistoriqueCommande({
        document: newDocument._id,
      });
      await newHistoriqueCommande.save();
  
      // Mis à jour le document avec l'historique de commandes
      newDocument.historiqueCommandes = newHistoriqueCommande._id;
      await newDocument.save();
  
      res.status(201).json(newDocument);
    } catch (error) {
      next(error);
    }
  },
  

  /**
   * Modification d'un document existant (juste le titre)
   */
  editDocument: async (req, res) => {
    try {
      const { titre } = req.body;
      const document = req.document;

      document.titre = titre || document.titre;
      await document.save();

      res.status(200).json(document);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Suppression d'un document existant et de toutes les données associées
   */
  deleteDocument: async (req, res) => {
    try {

      const document = req.document;

      await Document.deleteOne({ _id: document._id });
      res.status(200).json({ message: "Document supprimé avec succès" });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Récupération d'un document avec toutes les informations
   */
  getDocument: async (req, res) => {
    try {
      const { id } = req.params;

      const document = req.document;

      res.status(200).json(document);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Récupération de tous les documents d'un utilisateur avec les informations de base
   */
  // TODO Ajouter pagination et filtres
  getDocuments: async (req, res) => {
    try {
      const idCompte = req.compte._id;
      const documents = await Document.find({ proprietaire: idCompte });

      res.status(200).json(documents);
    } catch (error) {
      next(error);
    }
  },

  getPermissions: async (req, res) => {
    try {
      const document = req.document;

      let permissions = document.permissions;

      // Renvoyer les permissions du document
      res.status(200).json(permissions);
    } catch (error) {
      next(error);
    }
  },


  /**
   * Ajout d'une permission à un document pour un utilisateur
   */
  addPermission: async (req, res) => {
    try {
      const { id } = req.params;
      const { idCompte, niveauPermission } = req.body;

      // idCompte est obligatoire
      if (!idCompte) {
        let error = new Error("idCompte manquant");
        error.status = 400;
        throw error;
      }

      // niveauPermission est obligatoire
      if (!niveauPermission) {
        let error = new Error("niveauPermission manquant");
        error.status = 400;
        throw error;
      }

      // Vérifie si le niveau de permission est valide
      if (!Object.values(NiveauPermission).includes(niveauPermission) || niveauPermission === NiveauPermission.PROPRIETAIRE) {
        let error = new Error("Niveau de permission invalide");
        error.status = 400;
        throw error;
      }

      // Vérifie s'il existe déjà une permission pour ce compte et ce document
      // Si oui, renvoie la permission existante
      // Si non, crée une nouvelle permission
      let permission = await Permission.findOne({ document: id, compte: idCompte });

      if (permission) {
        return res.status(200).json(permission);
      }

      const newPermission = new Permission({
        document: id,
        compte: idCompte,
        niveauPermission,
      });

      await newPermission.save();

      res.status(200).json(newPermission);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Modification d'une permission existante
   */
  editPermission: async (req, res) => {
    try {
      const { id } = req.params;
      const { niveauPermission } = req.body;

      const permission = await Permission.findById(id);

      if (!permission) {
        let error = new Error("Permission non trouvée");
        error.status = 404;
        throw error;
      }

      // Vérifie si le niveau de permission est valide
      if (!Object.values(NiveauPermission).includes(niveauPermission) || niveauPermission === NiveauPermission.PROPRIETAIRE) {
        let error = new Error("Niveau de permission invalide");
        error.status = 400;
        throw error;
      }

      // On récupère la permission qui est associé a ce document et à ce compte
      const permissionDeModifier = await Permission.findOne({ document: permission.document, compte: permission.compte });

      // On vérifie si la permission existe et si l'utilisateur à le droit de modifier la permission
      if (!permissionDeModifier || permissionDeModifier.niveauPermission < NiveauPermission.ADMIN) {
        let error = new Error("Action non autorisée");
        error.status = 403;
        throw error;
      }
      

      res.status(200).json(permission);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Suppression d'une permission existante
   */
  deletePermission: async (req, res) => {
    try {
      const { id } = req.params;

      const permission = await Permission.findById(id);

      if (!permission) {
        let error = new Error("Permission non trouvée");
        error.status = 404;
        throw error;
      }

      // On récupère la permission qui est associé a ce document et à ce compte
      const permissionDeModifier = await Permission.findOne({ document: permission.document, compte: permission.compte });

      // On vérifie si la permission existe et si l'utilisateur à le droit de modifier la permission
      if (!permissionDeModifier || permissionDeModifier.niveauPermission < NiveauPermission.ADMIN) {
        let error = new Error("Action non autorisée");
        error.status = 403;
        throw error;
      }

      await Permission.deleteOne({ _id: id });

      res.status(200).json({ message: "Permission supprimée avec succès" });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Récupération d'une feuille spécifique
   */
  getFeuille: async (req, res) => {
    try {
      const { id } = req.params;
      const idCompte = req.compte._id;

      // Récupérer la feuille spécifique et vérifier si elle existe
      const feuille = await Feuille.findById(id).populate('document');
      if (!feuille) {
        let error = new Error("La feuille n'existe pas");
        error.status = 404;
        throw error;
      }

      // Récupérer le document associé à la feuille et vérifier si l'utilisateur a le droit de voir les feuilles
      const document = feuille.document;
      if (!verifierPermission(document, idCompte, NiveauPermission.LECTURE)) {
        let error = new Error("Action non autorisée");
        error.status = 403;
        throw error;
      }

      // Renvoyer les informations de la feuille
      res.status(200).json(feuille);
    } catch (error) {
      next(error);
    }
  },


  /**
   * Récupération de toutes les feuilles d'un document avec toutes les informations
   */
  getFeuilles: async (req, res) => {
    try {
      const { id } = req.params;
      const feuilles = await Feuille.find({ document: id });

      res.status(200).json(feuilles);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Ajout d'une feuille à un document existant
   */
  addFeuille: async (req, res) => {
    try {
      const { id } = req.params;
      const { feuille } = req.body; // Contenu de la feuille
      const idCompte = req.compte._id;
      const document = req.document;

      // Crée une nouvelle feuille

      const newFeuille = new Feuille({
        document: id,
        // Valeur par défaut du nom ou valeur passée en paramètre
        nom: feuille.nom || Feuille.schema.obj.nom.default,
        cellules: feuille.cellules || Feuille.schema.obj.cellules.default,
      })
      await newFeuille.save();

      document.feuilles.push(newFeuille._id);
      await document.save();

      res.status(201).json(newFeuille);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Modification d'une feuille existante
   */
  editFeuille: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const idCompte = req.compte._id;

      // Récupérer la feuille et vérifier si elle existe
      const feuille = await Feuille.findById(id).populate('document', 'permissions');

      if (!feuille) {
        let error = new Error("Feuille non trouvée");
        error.status = 404;
        throw error;
      }

      // Vérifier si l'utilisateur a le droit de modifier la feuille
      if (!verifierPermission(feuille.document, idCompte, NiveauPermission.ECRITURE)) {
        let error = new Error("Action non autorisée");
        error.status = 403;
        throw error;
      }

      feuille.nom = data.nom || feuille.nom;
      feuille.cellules = data.cellules || feuille.cellules;
      await feuille.save();

      res.status(200).json(feuille);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Suppression d'une feuille existante
   */
  deleteFeuille: async (req, res) => {
    try {
      const { id, idFeuille } = req.params;
      const idCompte = req.compte._id; // ID de l'utilisateur actuel

      // Récupérer la feuille et vérifier si elle existe
      const feuille = await Feuille.findById(id).populate('document', 'permissions');

      if (!feuille) {
        let error = new Error("Feuille non trouvée");
        error.status = 404;
        throw error;
      }

      // Vérifier si l'utilisateur a le droit de supprimer la feuille (propriétaire)
      if (!verifierPermission(feuille.document, idCompte, NiveauPermission.PROPRIETAIRE)) {
        let error = new Error("Action non autorisée");
        error.status = 403;
        throw error;
      }


      // Suppression de la feuille
      await Feuille.deleteOne({ _id: idFeuille });

      res.status(200).json({ message: "Feuille supprimée avec succès" });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Récupération de l'historique des commandes d'un document
   */
  getHistoriqueCommandes: async (req, res) => {
    try {
      const { id } = req.params;  

      // Récupérer l'historique des commandes
      const historiqueCommandes = await HistoriqueCommande.find({ document: id });
      res.status(200).json(historiqueCommandes);
    } catch (error) {
      next(error);
    }
  },

  connect: async (ws, req) => {
    const documentId = req.params.id;
    const document = await Document.findById(documentId).populate('historiqueCommandes feuilles.cellules permissions.compte');

    // Vérifier si le document existe sinon fermer la connexion et envoyer un message d'erreur
    if (!document) {
      ws.close(400, 'Document non trouvé');
      return;
    }

    // Ajoute le client à la room du document
    if (!rooms[documentId]) {
      rooms[documentId] = new Set();
    }
    rooms[documentId].add(ws);

    // Envoyer le document au client ainsi que l'historique des commandes
    ws.send(JSON.stringify(document));

    ws.on('message', function incoming(message) {
      // Traiter le message comme une commande
      const commande = JSON.parse(message);
      // valider la commande
      if (!commande || !commande.type) {
        ws.send(JSON.stringify({ type: 'error', message: 'Commande invalide' }));
        return;
      }

      commande.document = document._id;
      commande.save()
        .then(commande => {
          // Ajouter la commande à l'historique des commande du document
          document.historiqueCommandes.push(commande._id);
          document.save();
        })
        .catch(error => {
          // Previent le client que la commande n'a pas pu être sauvegardée avec un code approprié
          ws.send(JSON.stringify({ type: 'error', message: 'Erreur lors de la sauvegarde de la commande' }));
        });



      // Diffuser la commande à tous les autres clients connectés à ce document
      rooms[documentId].forEach(client => {
        if (client !== ws) {
          client.send(JSON.stringify(commande));
        }
      });
    });

    ws.on('close', function close() {
      // Gérer la déconnexion
      rooms[documentId].delete(ws);
      if (rooms[documentId].size === 0) {
        delete rooms[documentId];
      }
    });
  },

};

export default documentController;

