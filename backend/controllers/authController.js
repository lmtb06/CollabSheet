import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Compte from "../models/compte/compte.js";
import Document from "../models/document/document.js";

const authController = {
  // Traitement de la connexion
  login: async (req, res, next) => {
    try {
      const { email, motDePasse } = req.body;
      const compte = await Compte.findOne({ email });

      if (compte && (await bcrypt.compare(motDePasse, compte.motDePasse))) {
        const token = jwt.sign(
          { idCompte: compte._id },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        res.status(200).json({ message: "Connexion réussie", token });
      } else {
        let error = new Error("Email ou mot de passe incorrect");
        error.statusCode = 400;
        throw error;
      }
    } catch (error) {
      next(error);
    }
  },

  // Traitement de l'inscription
  register: async (req, res, next) => {
    try {
      const { nom, prenom, email, motDePasse } = req.body;

      // Vérifier si l'email existe déjà
      const compteExistant = await Compte.findOne({ email });
      if (compteExistant) {
        let error = new Error("Un compte avec cet email existe déjà");
        error.statusCode = 400;
        throw error;
      }

      // Création du compte
      const nouveauCompte = new Compte({
        nom,
        prenom,
        email,
        motDePasse,
      });

      await nouveauCompte.save();
      const token = jwt.sign(
        { idCompte: nouveauCompte._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(201).json({ message: "Compte créé avec succès", token });
    } catch (error) {
      next(error);
    }
  },

  // Récupération des informations du compte
  getCompte: async (req, res, next) => {
    try {
      // TODO Avatar
      res.status(200).json(
        {
          message: "Informations du compte récupérées avec succès",
          compte: {
            nom: req.compte.nom,
            prenom: req.compte.prenom,
            email: req.compte.email,
            dateDeCreation: req.compte.dateDeCreation,
            dateDeModification: req.compte.dateDeModification,
          }
        }
      );
    } catch (error) {
      next(error);
    }
  },

  // Modification des informations du compte
  editCompte: async (req, res, next) => {
    try {
      const idCompte = req.compte._id;
      // TODO Avatar
      const { nom, prenom, email, motDePasse } = req.body;


      const compte = req.compte;
      compte.nom = nom || compte.nom;
      compte.prenom = prenom || compte.prenom;
      compte.email = email || compte.email;
      compte.motDePasse = motDePasse || compte.motDePasse;

      await compte.save();
      // Send back the updated user without the password
      res.status(200).json({
        message: "Compte modifié avec succès",
        compte: {
          nom: compte.nom,
          prenom: compte.prenom,
          email: compte.email,
          dateDeCreation: compte.dateDeCreation,
          dateDeModification: compte.dateDeModification,
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // Suppression du compte
  deleteCompte: async (req, res, next) => {
    try {
      // Suppression des documents liés
      await Document.deleteMany({ proprietaire: req.compte._id });
      await Compte.deleteOne({ _id: req.compte._id });

      res.status(200).json({ message: "Compte supprimé avec succès" });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
