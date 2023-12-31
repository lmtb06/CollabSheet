import express from "express";
import authController from "../../controllers/authController.js";
import documentController from "../../controllers/documentController.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js"; // Middleware d'authentification
import { verifierPermissionMiddleware } from "../../middlewares/documentMiddleware.js";
import { NiveauPermission } from "../../../commun/models/permission.mjs";

const router = express.Router();

// Gestion de l'authentification
router.post(
  "/login",
  authController.login);

router.post(
  "/register",
  authController.register);

// router
//   .post("/forgot-password", authController.forgotPassword)
//   .put("/reset-password/:token", authController.resetPassword);

// Gestion du compte
router
  .get(
    "/compte",
    authMiddleware,
    authController.getCompte
  )
  .put(
    "/compte",
    authMiddleware,
    authController.editCompte
  )
  .delete(
    "/compte",
    authMiddleware,
    authController.deleteCompte
  );

// Gestion des documents
router
  
  .get(
    "/documents",
    authMiddleware,
    documentController.getDocuments
  )
  .post(
    "/document/create",
    authMiddleware,
    documentController.createDocument
  )
  .get(
    "/document/:id",
    authMiddleware,
    verifierPermissionMiddleware(NiveauPermission.LECTURE),
    documentController.getDocument
  )
  .put(
    "/document/:id",
    authMiddleware,
    verifierPermissionMiddleware(NiveauPermission.ECRITURE),
    documentController.editDocument
  )
  .delete(
    "/document/:id",
    authMiddleware,
    verifierPermissionMiddleware(NiveauPermission.PROPRIETAIRE),
    documentController.deleteDocument
  );

// Gestion des permissions
router
  .get(
    "/document/:id/permissions",
    authMiddleware,
    verifierPermissionMiddleware(NiveauPermission.ADMIN),
    documentController.getPermissions
  )
  .post(
    "/document/:id/permission",
    authMiddleware,
    verifierPermissionMiddleware(NiveauPermission.ADMIN),
    documentController.addPermission
  )
  .put(
    "permission/:idPermission",
    authMiddleware,
    documentController.editPermission
  )
  .delete(
    "/permission/:idPermission",
    authMiddleware,
    documentController.deletePermission
  );

// Gestion des feuilles
router
  .get(
    "/document/:id/feuilles",
    authMiddleware,
    verifierPermissionMiddleware(NiveauPermission.LECTURE),
    documentController.getFeuilles
  )
  .post(
    "/document/:id/feuille",
    authMiddleware,
    verifierPermissionMiddleware(NiveauPermission.ECRITURE),
    documentController.addFeuille
  )
  .get(
    "/feuille/:id",
    authMiddleware,
    documentController.getFeuille
  )
  .put(
    "/feuille/:id",
    authMiddleware,
    documentController.editFeuille
  )
  .delete(
    "/feuille/:id",
    authMiddleware,
    documentController.deleteFeuille
  );

  // Gestions de l'historique des commandes
router
.get(
  "/document/:id/historiqueCommandes",
  authMiddleware,
  verifierPermissionMiddleware(NiveauPermission.LECTURE),
  documentController.getHistoriqueCommandes
)

export default router;